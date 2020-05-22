import Boom from 'boom';
import { UserModel } from 'models';
import { Request } from 'express';
import { MutationArgs } from '../../../types';
import { sendReferralInvite, validateEmail } from '../../emails/sendgrid';

export async function inviteFriend(
  root: any,
  args: MutationArgs.InviteFriend,
  req: Request
) {
  if (!req.userId) {
    throw Boom.unauthorized('You must login first');
  }

  const user = await UserModel.findByPk(req.userId);
  const email = args.email.trim().toLowerCase();

  const knownContact = await UserModel.findOne({
    where: {
      email
    }
  });

  if (knownContact) {
    return false;
  }

  const { rejected, errorMessage } = await validateEmail({
    email,
    source: 'Invite'
  });

  if (rejected) {
    throw Boom.badRequest('Fail to send an invite', {
      email: errorMessage
    });
  }

  await sendReferralInvite(user, email);

  return true;
}
