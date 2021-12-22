import { UserModel } from 'cl-models';
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import { passwordResetTokenTTL } from '../../../shared/constants';
import { MutationArgs } from '../../../types';
import { publishSMS, sendSESEmail } from '../../lib/aws';
import { sourceEmail } from '../../lib/mailer';
import { GraphqlContext } from '../index';

export async function forgotPassword(
  _,
  args: MutationArgs.ForgotPassword,
  ctx: GraphqlContext
) {
  ctx.logger.info(args, 'user requests to reset password');

  const user = await UserModel.findOne({
    where: {
      email: args.email.trim().toLowerCase()
    }
  });

  if (!user) {
    return false;
  }

  const passwordResetToken = nanoid(8);
  const passwordResetExpires = DateTime.local()
    .plus({ minutes: passwordResetTokenTTL })
    .toJSDate();

  await user.update({
    passwordResetToken,
    passwordResetExpires
  });

  const sesResult = await sendSESEmail({
    FromEmailAddress: sourceEmail,
    Destination: {
      ToAddresses: [user.email]
    },
    Content: {
      Template: {
        TemplateArn:
          'arn:aws:mobiletargeting:us-west-2:816670140901:templates/reset-password/EMAIL',
        TemplateData: JSON.stringify({
          name: user.firstName,
          ttl: `${passwordResetTokenTTL} minutes`,
          token: passwordResetToken
        })
      }
    }
  });

  ctx.logger.info(
    { ...sesResult.$response.data },
    'notified via email %s',
    user.email
  );

  if (user.phoneNumber) {
    const snsResult = await publishSMS(
      user.phoneNumber,
      `Use code ${passwordResetToken} to reset password on Create & Learn. Msg & data rates may apply. Reply HELP STOP to cancel.`
    );
    ctx.logger.info(
      { ...snsResult.$response.data },
      'notified via sms %s',
      user.phoneNumber
    );
  }

  return true;
}

export async function resetPassword(
  _,
  args: MutationArgs.ResetPassword,
  ctx: GraphqlContext
) {
  const user = await UserModel.findOne({
    where: {
      email: args.email,
      passwordResetToken: args.passwordResetToken
    }
  });

  if (!user || !user.passwordResetExpires) {
    ctx.badRequest('Not a valid token or email');
  }

  if (user.passwordResetExpires < new Date()) {
    ctx.badRequest(
      'Password reset token has expired, please try reset your password again'
    );
  }

  await user.update({
    password: args.password,
    passwordResetToken: null,
    passwordResetExpires: null
  });

  ctx.setIdentity(user);

  return user;
}
