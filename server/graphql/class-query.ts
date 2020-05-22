import { campClassMaxDays } from 'common';
import { ClassModel } from 'models';
import { captureException } from 'sentry';
import { Request } from 'express';
import { getCourse, getSubject } from '../lib/catalog-cache';
import { buildNextClass } from '../lib/class-query-helper';
import { getCampOffer, getUpgradeOffer } from '../lib/coupon-factory';
import { createLogger } from '../lib/logger';
import sequelize from '../sequelize';

export default {
  course(klass: ClassModel) {
    return getCourse(klass);
  },

  isCamp(klass: ClassModel) {
    return klass.sessions.length === 4 && klass.days < campClassMaxDays;
  },

  isWeekly(klass: ClassModel) {
    return klass.isWeekly();
  },

  async offer(klass: ClassModel, args: any, req: Request) {
    const course = getCourse(klass);
    if (!req.userId || !course.isRegular) {
      return null;
    }

    const fLogger = createLogger('ClassQueryOffer', {
      userId: req.userId,
      classId: klass.id
    });

    if (klass.days < campClassMaxDays) {
      fLogger.info('receive camp offer');
      return getCampOffer();
    }

    return getUpgradeOffer(req.userId, course, fLogger);
  },

  async studentIds(klass: ClassModel) {
    if (klass.students) {
      return klass.students.map(s => s.id);
    }

    const enrollments = klass.enrollments || (await klass.getEnrollments());
    return enrollments.map(e => e.studentId);
  },

  async isFull(klass: ClassModel) {
    const course = getCourse(klass);
    let numberOfRegistrations = klass.numberOfRegistrations;
    if (typeof numberOfRegistrations !== 'number') {
      numberOfRegistrations = await klass.countEnrollments();
    }

    return numberOfRegistrations >= course.capacity;
  },

  async series(klass: ClassModel) {
    const course = getCourse(klass);
    const subject = getSubject(course);

    if (
      course.level < 1 ||
      course.level >= subject.exitLevel ||
      klass.sessions.length !== 4
    ) {
      return null;
    }

    const tx = await sequelize.transaction();
    const series: ClassModel[] = [];
    const fLogger = createLogger('ClassQuerySeries', {});

    try {
      let current = klass;

      for (let level = course.level + 1; level <= subject.exitLevel; level++) {
        const next = buildNextClass(
          current,
          subject.courses.find(c => c.level === level)
        );

        current = await ClassModel.findOne({
          where: {
            courseId: next.courseId,
            startDate: next.startDate
          }
        });

        if (!current) {
          current = await next.save({ transaction: tx });
          fLogger.info(
            { classId: current.id },
            'Next level class %s created',
            current.courseId
          );
        }

        series.push(current);
      }

      await tx.commit();
    } catch (err) {
      await tx.rollback();
      fLogger.error(err, 'fail to create class series');
      captureException(err);
      return null;
    }

    return series;
  }
};
