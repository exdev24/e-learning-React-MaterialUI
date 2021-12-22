import { coursePerUnitPrice, CreditType, ReferralCredits } from 'cl-common';
import {
  ClassModel,
  CourseModel,
  CreditModel,
  EnrollmentModel,
  PromotionModel,
  StudentModel,
  TransactionModel
} from 'cl-models';
import { Op } from 'sequelize';
import {
  applyCredit,
  applyPromo,
  getTotalPriceInCents
} from '../../../shared/pricing';
import { MutationArgs, StudentIdVars } from '../../../types';
import { sale } from '../../braintree/braintree';
import { getPromotionIfQualified } from '../../lib/coupon-factory';
import { emitEnrollClassEvent } from '../../lib/event-bus';
import sequelize from '../../sequelize';
import { GraphqlContext } from '../index';

async function getStudent(args: StudentIdVars, userId: string) {
  return StudentModel.findOne({
    rejectOnEmpty: true,
    where: {
      id: args.studentId,
      parentId: userId
    }
  });
}

export async function enrollTrial(
  root,
  args: MutationArgs.EnrollTrial,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const [student, klass] = await Promise.all([
    getStudent(args, ctx.userId),
    ClassModel.findByPk(args.classId, {
      rejectOnEmpty: true,
      include: [CourseModel]
    })
  ]);

  if (klass.course.price > 0) {
    ctx.badRequest(
      'Only introductory class is available for express checkout',
      klass.details
    );
  }

  const logger = ctx.logger.child({
    mutation: 'enrollTrial',
    classId: klass.id
  });

  const tx = await sequelize.transaction();

  try {
    const enrollment = await EnrollmentModel.create(
      {
        studentId: student.id,
        classId: klass.id,
        source: args.source,
        campaign: args.campaign
      },
      { transaction: tx }
    );

    enrollment.student = student;
    enrollment.class = klass;

    if (typeof args.optIn === 'boolean') {
      await student.update(
        { [`details.optIns.${klass.course.subjectId}`]: args.optIn },
        { transaction: tx }
      );
    }

    await tx.commit();
    await emitEnrollClassEvent([enrollment]);
    logger.info({ success: true }, '%s enrolled %s', student.name, klass.courseId);

    return enrollment;
  } catch (err) {
    logger.error({ error: err, args });
    await tx.rollback();
    throw err;
  }
}

export async function enrollClass(
  root: any,
  args: MutationArgs.EnrollClass,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const student = await getStudent(args, ctx.userId);
  if (args.credit > 0) {
    const balanceInCents = await student.parent.getBalanceInCents();
    if (args.credit > balanceInCents) {
      ctx.badRequest('You do not have enough credit');
    }
  }

  const klasses = await ClassModel.scope(['defaultScope', 'countStudent']).findAll({
    order: [[CourseModel, 'level', 'ASC']],
    include: [CourseModel],
    where: {
      id: {
        [Op.in]: args.classIds
      }
    }
  });

  const mainKlass = klasses[0];
  if (!mainKlass) {
    ctx.badRequest('invalid classIds', args);
  }

  const logger = ctx.logger.child({
    mutation: 'enrollClass'
  });

  if (mainKlass.numberOfRegistrations >= mainKlass.course.capacity) {
    logger.warn('class is full');
    ctx.badRequest('This class if fully booked, please pick a different schedule.');
  }

  let priceInCents = getTotalPriceInCents(klasses);
  if (klasses.length > 1 && args.wholePackage && !args.promotionId) {
    priceInCents = klasses.length * coursePerUnitPrice * 100;
  }

  let usedCredit: CreditModel = null;
  let appliedPromo: PromotionModel = null;

  const tx = await sequelize.transaction();
  const txOpts = { transaction: tx };

  try {
    // apply promotion first
    if (priceInCents > 0 && args.promotionId) {
      appliedPromo = await getPromotionIfQualified(
        args.promotionId,
        student.parent,
        mainKlass.course
      );

      if (!appliedPromo) {
        ctx.badRequest(`promotion ${args.promotionId} is not valid`);
      }

      await appliedPromo.increment('counts', txOpts);
      priceInCents = applyPromo(priceInCents, appliedPromo, klasses.length).result;
      logger.info('used coupon %s', appliedPromo.code);
    }

    // apply credit if there is any
    if (priceInCents > 0 && args.credit > 0) {
      const applied = applyCredit(priceInCents, args.credit);
      const creditDetails: CreditModel['details'] = {
        reason: `Purchase ${mainKlass.course.name}`,
        createdBy: 'webportal',
        attribution: {
          userId: ctx.userId,
          classId: mainKlass.id
        }
      };

      usedCredit = await CreditModel.create(
        {
          cents: -applied.used,
          userId: ctx.userId,
          type: CreditType.Purchase,
          details: creditDetails
        },
        txOpts
      );

      priceInCents = applied.result;
      logger.info('used $%s credit', usedCredit.cents / 100);
    }

    if (mainKlass.course.isRegular && !student.parent.paid) {
      await student.parent.update({ paid: true }, txOpts);

      if (priceInCents > 0 && student.parent.refererId) {
        const creditDetails: CreditModel['details'] = {
          reason: `${student.parent.firstName} has purchased ${mainKlass.course.name}`,
          createdBy: 'firstPurchase',
          attribution: {
            classId: mainKlass.id,
            userId: student.parentId
          }
        };

        await CreditModel.create(
          {
            userId: student.parent.refererId,
            cents: ReferralCredits.purchase,
            type: CreditType.Referral,
            details: creditDetails
          },
          txOpts
        );
      }
    }

    const enrollments = await EnrollmentModel.bulkCreate(
      klasses.map(klass => ({
        studentId: student.id,
        classId: klass.id,
        source: args.source,
        campaign: args.campaign,
        promotionId: appliedPromo?.id,
        creditId: usedCredit?.id
      })),
      txOpts
    );

    if (priceInCents > 0) {
      const transactionDetails = await sale(
        priceInCents,
        args.paymentMethodNonce,
        args.classIds[0] + args.studentId,
        ctx
      );

      const saleRecord = await TransactionModel.create(
        { details: transactionDetails },
        txOpts
      );

      await saleRecord.addEnrollments(enrollments, txOpts);

      logger.info(transactionDetails);
    }

    await tx.commit();
    await emitEnrollClassEvent(enrollments);
    enrollments.forEach(er => {
      logger.info({ success: true, classId: er.classId }, 'class enrolled');
    });

    return enrollments;
  } catch (err) {
    logger.error({ error: err, args });
    await tx.rollback();
    throw err;
  }
}
