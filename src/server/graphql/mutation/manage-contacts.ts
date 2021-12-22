import { UserModel } from 'cl-models';
import { MutationArgs } from '../../../types';
import { validateEmail } from '../../lib/validator';
import { sendReferralInvite } from '../../lib/mailer';
import { GraphqlContext } from '../index';

export async function inviteFriend(
  root: any,
  args: MutationArgs.InviteFriend,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const user = await UserModel.findByPk(ctx.userId);
  const email = args.email.trim().toLowerCase();

  const knownContact = await UserModel.findOne({
    where: {
      email
    }
  });

  if (knownContact) {
    return false;
  }

  const [valid, errorMessage] = await validateEmail(email);
  if (!valid) {
    ctx.badRequest('Fail to send an invite', {
      email: errorMessage
    });
  }

  await sendReferralInvite(user, email);

  return true;
}
