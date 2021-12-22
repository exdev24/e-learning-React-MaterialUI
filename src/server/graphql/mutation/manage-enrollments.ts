import {
  ClassModel,
  CourseModel,
  EnrollmentModel,
  StudentModel,
  TransactionModel
} from 'cl-models';
import { IDVars, MutationArgs } from '../../../types';
import { emitRescheduleEvent } from '../../lib/event-bus';
import sequelize from '../../sequelize';
import { GraphqlContext } from '../index';

export async function cancelEnrollment(_, args: IDVars, ctx: GraphqlContext) {
  ctx.assertAuthenticated();

  const record = await EnrollmentModel.findByPk(args.id, {
    rejectOnEmpty: true,
    include: [
      TransactionModel,
      {
        model: StudentModel.unscoped(),
        required: true,
        where: {
          parentId: ctx.userId
        }
      }
    ]
  });

  const fLogger = ctx.logger.child({
    mutation: 'cancelEnrollment',
    classId: args.id
  });

  if (record.transactions.length > 0) {
    fLogger.warn('cannot cancel a paid class');
    ctx.badRequest('Please contact us to get refund');
  }

  await record.destroy();
  fLogger.info('class is canceled');

  return true;
}

export async function rescheduleEnrollment(
  _,
  args: MutationArgs.RescheduleEnrollment,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const record = await EnrollmentModel.findByPk(args.id, {
    rejectOnEmpty: true,
    include: [
      ClassModel,
      {
        model: StudentModel.unscoped(),
        required: true,
        where: {
          parentId: ctx.userId
        }
      }
    ]
  });

  const klass = await ClassModel.scope(['defaultScope', 'countStudent']).findByPk(
    args.classId,
    {
      rejectOnEmpty: true,
      include: [CourseModel]
    }
  );

  const fLogger = ctx.logger.child({
    mutation: 'rescheduleEnrollment',
    classId: klass.id
  });

  if (record.class.courseId !== klass.courseId) {
    fLogger.warn('%s is not the same course', klass.courseId);
    ctx.badRequest('Please contact us to switch to a different course');
  }

  if (args.idx >= 0) {
    const tx = await sequelize.transaction();
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
    if (klass.numberOfRegistrations >= klass.course.capacity) {
      fLogger.warn('%s is full', klass.courseId);
      ctx.badRequest('Please contact us to switch to a different course');
    }

    const tx = await sequelize.transaction();
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
