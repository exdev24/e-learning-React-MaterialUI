import Boom from 'boom';
import { UserModel } from 'models';
import { Request } from 'express';
import requestIP from 'request-ip';
import { MutationArgs } from '../../../types';
import { createLogger } from '../../lib/logger';
import { setIdentity } from '../../middlewares/auth';

export default async function signIn(
  root: any,
  args: MutationArgs.SignIn,
  req: Request
) {
  const user = await UserModel.findOne({
    where: {
      email: args.email.toLowerCase()
    }
  });

  if (!user) {
    throw Boom.badRequest('fail to login', {
      email: 'email not found'
    });
  }

  const fLogger = createLogger('signIn', { userId: user.id });
  const isMatch = await user.compare(args.password);

  if (!isMatch) {
    fLogger.warn('password does not match');
    throw Boom.badRequest('fail to login', {
      password: 'password does not match, try again or reset password.'
    });
  }

  await user.setDetails({
    lastLogin: new Date(),
    clientIp: requestIP.getClientIp(req)
  });

  fLogger.info('user %s logged in', user.email);
  setIdentity(req, user);

  return user;
}
