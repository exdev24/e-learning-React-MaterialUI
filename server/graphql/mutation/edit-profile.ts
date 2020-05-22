import Boom from 'boom';
import { UserModel } from 'models';
import { Request } from 'express';
import { IANAZone } from 'luxon';
import { MutationArgs } from '../../../types';
import { emitAccountUpdated } from '../../lib/event-bus';
import { setIdentity } from '../../middlewares/auth';

export default async function editProfile(
  root: any,
  args: MutationArgs.EditProfile,
  req: Request
) {
  if (!req.userId) {
    throw Boom.unauthorized('You must login first');
  }

  const user = await UserModel.findByPk(req.userId);

  if (args.password) {
    const isMatch = await user.compare(args.previous);

    if (!isMatch) {
      throw Boom.badRequest('fail to update profile', {
        previous: 'password does not match'
      });
    }

    return user.update({
      password: args.password
    });
  }

  if (args.email) {
    user.set('email', args.email);
  }

  if (args.firstName) {
    user.set('firstName', args.firstName);
  }

  if (args.lastName) {
    user.set('lastName', args.lastName);
  }

  if (args.referralCode) {
    user.set('referralCode', args.referralCode);
  }

  if (args.timezone && IANAZone.isValidZone(args.timezone)) {
    user.set('details', { ...user.details, timezone: args.timezone });
  }

  await user.save();
  await emitAccountUpdated(user.id);

  setIdentity(req, user);

  return user;
}
