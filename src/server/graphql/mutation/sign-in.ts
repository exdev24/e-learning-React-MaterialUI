import { UserModel } from 'cl-models';
import requestIP from 'request-ip';
import { MutationArgs } from '../../../types';
import { GraphqlContext } from '../index';

export default async function signIn(
  root: any,
  args: MutationArgs.SignIn,
  ctx: GraphqlContext
) {
  const user = await UserModel.findOne({
    where: {
      email: args.email.toLowerCase()
    }
  });

  if (!user) {
    ctx.badRequest('fail to login', {
      email: 'email not found'
    });
  }

  const isMatch = await user.compare(args.password);

  if (!isMatch) {
    ctx.logger.warn({ userId: user.id }, 'password does not match');
    ctx.badRequest('fail to login', {
      password: 'password does not match, try again or reset password.'
    });
  }

  await user.setDetails({
    lastLogin: new Date(),
    clientIp: requestIP.getClientIp(ctx.req)
  });

  ctx.setIdentity(user);
  ctx.logger.info({ userId: user.id }, 'user %s logged in', user.email);

  return user;
}
