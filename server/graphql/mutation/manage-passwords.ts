import Boom from 'boom';
import { UserModel } from 'models';
import { Request } from 'express';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { passwordResetTokenTTL } from '../../../shared/constants';
import { MutationArgs } from '../../../types';
import { sendResetPasswordEmail } from '../../emails/mailer';
import logger from '../../lib/logger';
import { setIdentity } from '../../middlewares/auth';

export async function forgotPassword(root: any, args: MutationArgs.ForgotPassword) {
  const user = await UserModel.findOne({
    where: {
      email: args.email.trim().toLowerCase()
    }
  });

  logger.info(args, 'user requests to reset password');

  if (!user) {
    return false;
  }

  const passwordResetToken = nanoid(10) as string;
  const passwordResetExpires = DateTime.local()
    .plus({ hours: passwordResetTokenTTL })
    .toJSDate();

  await user.update({
    passwordResetToken,
    passwordResetExpires
  });
  await sendResetPasswordEmail(user);

  return true;
}

export async function resetPassword(
  root,
  args: MutationArgs.ResetPassword,
  req: Request
) {
  const user = await UserModel.findOne({
    where: {
      email: args.email,
      passwordResetToken: args.passwordResetToken
    }
  });

  if (!user || !user.passwordResetExpires) {
    throw Boom.badRequest('Not a valid token or email');
  }

  if (user.passwordResetExpires < new Date()) {
    throw Boom.badRequest(
      'Password reset token has expired, please try reset your password again'
    );
  }

  await user.update({
    password: args.password,
    passwordResetToken: null,
    passwordResetExpires: null
  });

  setIdentity(req, user);

  return user;
}
