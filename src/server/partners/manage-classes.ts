import { ClassModel, CourseModel, SessionModel, TeacherModel } from 'cl-models';
import { isEqual, last } from 'lodash';
import { Op, Transaction } from 'sequelize';
import { catalogStore } from '../lib/dataloader';
import { emitClassUpdatedEvent } from '../lib/event-bus';
import logger from '../lib/logger';
import { PartnerImportClassData } from './types';

/**
 * All code in this file is very similar to the mutation handler in API.
 * It's only intended for MVP use.
 * Need to reuse code in the future
 */

export async function updateClass(
  classId: string,
  teacher: TeacherModel,
  schedules: [Date, Date][],
  tx: Transaction
) {
  const klass = await ClassModel.findByPk(classId, {
    rejectOnEmpty: true,
    include: [CourseModel, TeacherModel]
  });
  const teacherChanged = teacher.id !== klass.teacherId;
  const scheduleChanged = !isEqual(klass.schedules, schedules);

  if (scheduleChanged) {
    const sessions = schedules.map((schedule, idx) => {
      const session =
        klass.sessions[idx] ||
        new SessionModel({
          classId: klass.id,
          idx
        });

      session.set('startDate', schedule[0]);
      session.set('endDate', schedule[1]);
      return session;
    });

    if (sessions.length < klass.sessions.length) {
      const idsToRemove = klass.sessions.slice(sessions.length).map(ses => ses.id);
      await SessionModel.destroy({
        transaction: tx,
        where: {
          id: {
            [Op.in]: idsToRemove
          }
        }
      });
    }

    await SessionModel.bulkCreate(
      sessions.map(ses => ses.toJSON()),
      {
        transaction: tx,
        updateOnDuplicate: ['startDate', 'endDate']
      }
    );

    klass.set('sessions', sessions);
    klass.set('startDate', sessions[0].startDate);
    klass.set('endDate', last(sessions).endDate);
    logger.info('class schedule is updated %o', klass.schedules);
  }

  if (teacherChanged) {
    logger.info('assign %s to class', teacher.fullName);
    klass.set('teacherId', teacher.id);
    klass.set('teacher', teacher);
  }

  await klass.save({ transaction: tx });

  await emitClassUpdatedEvent({
    classId: klass.id,
    teacherChanged,
    scheduleChanged
  });
  logger.info({ classId: klass.id }, 'class updated');

  return klass;
}

export async function createClass(
  classData: PartnerImportClassData,
  teacher: TeacherModel,
  schedules: [Date, Date][],
  tx: Transaction
) {
  const klass = await ClassModel.create(
    {
      courseId: classData.courseId,
      teacherId: teacher.id,
      active: true,
      // details: pick(args, 'dialInLink', 'note'),
      startDate: schedules[0][0],
      endDate: last(schedules)[1],
      sessions: schedules.map((session, idx) => ({
        idx,
        startDate: session[0],
        endDate: session[1]
      }))
    },
    {
      include: [SessionModel],
      transaction: tx
    }
  );

  logger.info({ classId: klass.id }, 'class created');

  klass.course = await catalogStore.getCourseById(klass.courseId);
  if (klass.teacherId) {
    klass.teacher = await TeacherModel.findByPk(klass.teacherId);
  }

  return klass;
}
