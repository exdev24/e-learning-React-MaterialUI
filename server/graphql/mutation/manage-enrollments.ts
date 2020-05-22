import Boom from 'boom';
import {
  ClassModel,
  CourseModel,
  EnrollmentModel,
  StudentModel,
  TransactionModel
} from 'models';
import { Request } from 'express';
import { IDVars, MutationArgs } from '../../../types';
import { emitRescheduleEvent } from '../../lib/event-bus';
import { createLogger } from '../../lib/logger';
import sequelize from '../../sequelize';

export async function cancelEnrollment(root, args: IDVars, req: Request) {
  if (!req.userId) {
    throw Boom.unauthorized('Please login to cancel a registration');
  }

  const record = await EnrollmentModel.findByPk(args.id, {
    rejectOnEmpty: true,
    include: [
      TransactionModel,
      {
        model: StudentModel.unscoped(),
        required: true,
        where: {
          parentId: req.userId
        }
      }
    ]
  });

  const fLogger = createLogger('cancelEnrollment', {
    userId: req.userId,
    classId: args.id
  });

  if (record.transactions.length > 0) {
    fLogger.warn('cannot cancel a paid class');
    throw Boom.badRequest('Please contact us to get refund');
  }

  fLogger.info('class is canceled');
  await record.destroy();
  return true;
}

export async function rescheduleEnrollment(
  root: any,
  args: MutationArgs.RescheduleEnrollment,
  req: Request
) {
  if (!req.userId) {
    throw Boom.unauthorized('Please login to reschedule a registration');
  }

  const record = await EnrollmentModel.findByPk(args.id, {
    rejectOnEmpty: true,
    include: [
      ClassModel,
      {
        model: StudentModel.unscoped(),
        required: true,
        where: {
          parentId: req.userId
        }
      }
    ]
  });

  const klass = await ClassModel.findByPk(args.classId, {
    rejectOnEmpty: true,
    include: [
      CourseModel,
      {
        model: EnrollmentModel,
        attributes: ['id']
      }
    ]
  });

  const fLogger = createLogger('rescheduleEnrollment', {
    userId: req.userId,
    classId: klass.id
  });

  if (record.class.courseId !== klass.courseId) {
    fLogger.warn('%s is not the same course', klass.courseId);
    throw Boom.badRequest('Please contact us to switch to a different course');
  }

  if (klass.enrollments.length >= klass.course.capacity) {
    fLogger.warn('%s is full', klass.courseId);
    throw Boom.badRequest('Please contact us to switch to a different course');
  }

  const tx = await sequelize.transaction();

  if (args.idx >= 0) {
    try {
      await record.addToSession(klass.sessions[args.idx], tx);
      await tx.commit();
    } catch (err) {
      fLogger.error(err);
      await tx.rollback();
      throw err;
    }

    fLogger.info('added on to session %d', args.idx + 1);
  } else {
    try {
      await record.reschedule(klass, 'self', tx);
      await tx.commit();
    } catch (err) {
      await tx.rollback();
      throw err;
    }

    await emitRescheduleEvent(record);
    fLogger.info('reschedule success');
    fLogger.info({ classId: record.classId }, 'previous registration is cancelled');
  }

  return record;
}
