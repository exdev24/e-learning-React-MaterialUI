import { ClassModel, EnrollmentModel, UserModel } from 'models';
import { Op } from 'sequelize';
import { generateClientToken } from '../braintree/braintree';
import { getTrialCourseIds } from '../lib/catalog-cache';

export default {
  braintreeToken(user: UserModel) {
    return generateClientToken(user);
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

  async canEnrollTrial(user: UserModel) {
    const children = user.children || (await user.getChildren());
    if (children.length === 0 || user.isInternal) {
      return true;
    }

    const trials = await EnrollmentModel.findAll({
      where: {
        studentId: {
          [Op.in]: children.map(child => child.id)
        }
      },
      include: [
        {
          model: ClassModel.unscoped(),
          required: true,
          where: {
            courseId: {
              [Op.in]: getTrialCourseIds()
            }
          }
        }
      ]
    });

    const now = new Date();
    const quota = 1 + children.length;

    let pendingTrials = 0;
    let attendedTrials = 0;

    for (const er of trials) {
      if (er.class.startDate > now) {
        pendingTrials++;
      }
      if (er.statusCode > 0) {
        attendedTrials++;
      }
    }

    if (pendingTrials >= quota) {
      return false;
    }

    return user.paid || attendedTrials < quota;
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
