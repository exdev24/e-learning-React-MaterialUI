import Boom from 'boom';
import { coursePerUnitPrice, CreditType, ReferralCredits } from 'common';
import {
  ClassModel,
  CourseModel,
  CreditModel,
  EnrollmentModel,
  PromotionModel,
  StudentModel,
  TransactionModel
} from 'models';
import { Request } from 'express';
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
import { createLogger } from '../../lib/logger';
import sequelize from '../../sequelize';

async function getStudent(args: StudentIdVars, req: Request) {
  return StudentModel.findOne({
    rejectOnEmpty: true,
    where: {
      id: args.studentId,
      parentId: req.userId
    }
  });
}

export async function enrollTrial(
  root,
  args: MutationArgs.EnrollTrial,
  req: Request
) {
  if (!req.userId) {
    throw Boom.unauthorized('You must login first');
  }

  const [student, klass] = await Promise.all([
    getStudent(args, req),
    ClassModel.findByPk(args.classId, {
      rejectOnEmpty: true,
      include: [CourseModel]
    })
  ]);

  if (klass.course.price > 0) {
    throw Boom.badRequest(
      'Only introductory class is available for express checkout',
      klass.details
    );
  }

  const fLogger = createLogger('enrollTrial', {
    userId: req.userId,
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

    if (args.webinarOptIn !== student.webinar) {
      await student.update(
        { 'details.webinar': args.webinarOptIn },
        { transaction: tx }
      );
    }

    fLogger.info('%s enrolled %s', student.name, klass.courseId);

    await tx.commit();
    await emitEnrollClassEvent([enrollment]);

    return enrollment;
  } catch (err) {
    fLogger.error({ error: err, payload: args });
    await tx.rollback();
    throw err;
  }
}

export async function enrollClass(
  root: any,
  args: MutationArgs.EnrollClass,
  req: Request
) {
  if (!req.userId) {
    throw Boom.unauthorized('You must login first');
  }

  const student = await getStudent(args, req);
  if (args.credit > 0) {
    const balanceInCents = await student.parent.getBalanceInCents();
    if (args.credit > balanceInCents) {
      throw Boom.badRequest('You do not have enough credit');
    }
  }

  const klasses = await ClassModel.findAll({
    order: [[CourseModel, 'level', 'ASC']],
    include: [
      CourseModel,
      {
        model: EnrollmentModel,
        attributes: ['id']
      }
    ],
    where: {
      id: {
        [Op.in]: args.classIds
      }
    }
  });

  const mainKlass = klasses[0];
  if (!mainKlass) {
    throw Boom.badRequest('invalid classIds', args);
  }

  const fLogger = createLogger('enrollClass', {
    userId: req.userId,
    classId: mainKlass.id
  });

  if (mainKlass.enrollments.length >= mainKlass.course.capacity) {
    fLogger.warn('class is full');
    throw Boom.badRequest(
      'This class if fully booked, please pick a different schedule.'
    );
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
        throw Boom.badRequest(`promotion ${args.promotionId} is not valid`);
      }

      await appliedPromo.increment('counts', txOpts);
      priceInCents = applyPromo(priceInCents, appliedPromo, klasses.length).result;
      fLogger.info('used coupon %s', appliedPromo.code);
    }

    // apply credit if there is any
    if (priceInCents > 0 && args.credit > 0) {
      const applied = applyCredit(priceInCents, args.credit);
      const creditDetails: CreditModel['details'] = {
        reason: `Purchase ${mainKlass.course.name}`,
        createdBy: 'webportal',
        attribution: {
          userId: req.userId,
          classId: mainKlass.id
        }
      };

      usedCredit = await CreditModel.create(
        {
          cents: -applied.used,
          userId: req.userId,
          type: CreditType.Purchase,
          details: creditDetails
        },
        txOpts
      );

      priceInCents = applied.result;
      fLogger.info('used $%s credit', usedCredit.cents / 100);
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
        priceInCents / 100,
        args.paymentMethodNonce,
        args.classIds[0] + args.studentId
      );

      const saleRecord = await TransactionModel.create(
        { details: transactionDetails },
        txOpts
      );

      await saleRecord.addEnrollments(enrollments, txOpts);

      fLogger.info({ transactionDetails }, 'paid $%s', saleRecord.amount);
    }

    await tx.commit();
    await emitEnrollClassEvent(enrollments);

    return enrollments;
  } catch (err) {
    fLogger.error({ error: err, payload: args });
    await tx.rollback();
    throw err;
  }
}
