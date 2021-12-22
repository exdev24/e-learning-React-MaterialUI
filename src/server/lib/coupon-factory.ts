import { defaultTimezone, upgradeExpiration } from 'cl-common';
import {
  ClassModel,
  CourseModel,
  EnrollmentModel,
  PromotionModel,
  StudentModel,
  UserModel
} from 'cl-models';
import config from 'config';
import { DateTime } from 'luxon';
import { Logger } from 'pino';
import { Op } from 'sequelize';

const campCoupon = config.get('coupons.camp') as string;

export async function getCampOffer() {
  const promo = await PromotionModel.findOne({
    where: {
      code: campCoupon
    }
  });

  if (promo && promo.isValid) {
    return promo;
  }
}

export async function getUpgradeOffer(
  userId: string,
  course: CourseModel,
  fLogger: Logger
) {
  const klass = await getQualifiedClass(userId, course);
  if (!klass) {
    return null;
  }

  fLogger.info(
    `%s ending at %s qualifies upgrade offer`,
    klass.courseId,
    klass.endDate
  );

  const promos = await course.getPromotions();
  return promos.find(promo => promo.isValid);
}

export async function getPromotionIfQualified(
  promotionId: string,
  user: UserModel,
  course: CourseModel
): Promise<PromotionModel> {
  const promo = await PromotionModel.findByPk(promotionId);

  if (
    !promo ||
    !promo.isValid ||
    (promo.userId && user.id !== promo.userId) ||
    (promo.firstTimerOnly && user.paid)
  ) {
    return null;
  }

  if (promo.isLevelUp) {
    const qualified = await getQualifiedClass(user.id, course);
    if (!qualified) {
      return null;
    }
  }

  return promo;
}

export async function getQualifiedClass(userId: string, course: CourseModel) {
  if (!course.isRegular) {
    return null;
  }

  const now = DateTime.local().setZone(defaultTimezone);

  const trialDeadline = now
    .minus({ days: upgradeExpiration.trialToPay })
    .startOf('day')
    .toJSDate();

  const paidDeadline = now
    .minus({ days: upgradeExpiration.levelup })
    .startOf('day')
    .toJSDate();

  const prevEnrollments = await EnrollmentModel.findAll({
    include: [
      {
        model: StudentModel.unscoped(),
        required: true,
        where: {
          parentId: userId
        }
      },
      {
        model: ClassModel.unscoped(),
        include: [CourseModel],
        required: true,
        where: {
          startDate: {
            [Op.lt]: now.toJSDate()
          },
          endDate: {
            [Op.gt]: paidDeadline
          }
        }
      }
    ]
  });

  const result = prevEnrollments.find(er => {
    if (er.class.course.isTrial) {
      // attending an introductory class within 3 days in the same subject
      return (
        er.class.course.subjectId === course.subjectId &&
        er.class.endDate > trialDeadline
      );
    }

    if (er.class.course.isRegular) {
      if (er.class.course.subjectId === course.subjectId) {
        // paid lower level class within 14days
        return er.class.course.level < course.level;
      } else {
        // jump from other paid class
        return course.level === 1;
      }
    }

    return false;
  });

  return result?.class;
}
