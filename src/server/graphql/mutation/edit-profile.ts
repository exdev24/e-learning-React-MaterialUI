import { UserModel } from 'cl-models';
import { MutationArgs } from '../../../types';
import {
  getValidTimezone,
  validateEmail,
  validatePhoneNumber
} from '../../lib/validator';
import { GraphqlContext } from '../index';

export default async function editProfile(
  root: any,
  args: MutationArgs.EditProfile,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const user = await UserModel.findByPk(ctx.userId);

  if (args.password) {
    const isMatch = await user.compare(args.previous);

    if (!isMatch) {
      ctx.badRequest('fail to update profile', {
        previous: 'password does not match'
      });
    }

    return user.update({
      password: args.password
    });
  }

  if (args.email && args.email !== user.email) {
    const [valid, errorMessage] = await validateEmail(args.email.trim());
    if (!valid) {
      ctx.badRequest('fail to update profile', {
        email: errorMessage
      });
    }

    user.set('email', args.email);
  }

  if (args.phoneNumber) {
    const [valid, phoneNumber] = validatePhoneNumber(
      args.phoneNumber,
      args.countryCode
    );
    if (!valid) {
      ctx.badRequest('fail to update profile', {
        phoneNumber: 'Not a valid mobile number'
      });
    }

    user.set('phoneNumber', phoneNumber);
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

  if (args.timezone) {
    user.set('details', {
      ...user.details,
      timezone: getValidTimezone(args.timezone)
    });
  }

  await user.save();

  ctx.setIdentity(user);

  return user;
}
