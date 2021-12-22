import { EnrollmentModel, UserModel } from 'cl-models';
import { generateClientToken } from '../braintree/braintree';
import { GraphqlContext } from '../graphql';

export default {
  braintreeToken(user: UserModel, args: any, ctx: GraphqlContext) {
    return generateClientToken(user, ctx);
  },

  async balanceInCents(user: UserModel) {
    return user.getBalanceInCents();
  },

  async children(user: UserModel) {
    return (
      user.children ||
      user.getChildren({
        include: [EnrollmentModel]
      })
    );
  },

  async credits(user: UserModel) {
    return user.credits || user.getCredits({ order: [['createdAt', 'DESC']] });
  },

  async promotions(user: UserModel) {
    const promotions =
      user.promotions ||
      (await user.getPromotions({ order: [['createdAt', 'DESC']] }));
    return promotions.filter(p => p.isValid);
  }
};
