import { captureException } from '@sentry/node';
import { Topic } from 'cl-common';
import { ClassModel } from 'cl-models';
import { Op } from 'sequelize';
import { buildNextClass } from '../lib/class-query-helper';
import { getCampOffer, getUpgradeOffer } from '../lib/coupon-factory';
import { catalogStore } from '../lib/dataloader';
import sequelize from '../sequelize';
import { GraphqlContext } from './index';

export default {
  course(c: ClassModel) {
    return c.course || catalogStore.getCourseById(c.courseId);
  },

  async hasClassroom(c: ClassModel) {
    if (!c.teacherId) {
      return false;
    }

    const course = c.course || (await catalogStore.getCourseById(c.courseId));
    return course.isRegular || course.subjectId === Topic.PARTNERS;
  },

  async canCancel(c: ClassModel) {
    if (c.endDate < new Date()) {
      return false;
    }

    const course = c.course || (await catalogStore.getCourseById(c.courseId));
    return course.price === 0;
  },

  async offer(klass: ClassModel, args: any, ctx: GraphqlContext) {
    const course =
      klass.course || (await catalogStore.getCourseById(klass.courseId));
    if (!ctx.userId || !course.isRegular) {
      return null;
    }

    if (await klass.isCamp()) {
      ctx.logger.info({ classId: klass.id }, 'receive camp offer');
      return getCampOffer();
    }

    return getUpgradeOffer(ctx.userId, course, ctx.logger);
  },

  async seats(klass: ClassModel) {
    const course =
      klass.course || (await catalogStore.getCourseById(klass.courseId));

    let numberOfRegistrations = klass.numberOfRegistrations;
    if (typeof numberOfRegistrations !== 'number') {
      numberOfRegistrations = await klass.countEnrollments();
    }

    return course.capacity - numberOfRegistrations;
  },

  async isFull(klass: ClassModel) {
    const course =
      klass.course || (await catalogStore.getCourseById(klass.courseId));

    let numberOfRegistrations = klass.numberOfRegistrations;
    if (typeof numberOfRegistrations !== 'number') {
      numberOfRegistrations = await klass.countEnrollments();
    }

    return numberOfRegistrations >= course.capacity;
  },

  async series(klass: ClassModel, args: any, ctx: GraphqlContext) {
    const course =
      klass.course || (await catalogStore.getCourseById(klass.courseId));
    const subject = await catalogStore.getSubjectById(course.subjectId);

    if (
      course.level < 1 ||
      course.level >= subject.exitLevel ||
      klass.sessions.length !== 4
    ) {
      return null;
    }

    const tx = await sequelize.transaction();
    const series: ClassModel[] = [];

    try {
      let current = klass;

      for (let level = course.level + 1; level <= subject.exitLevel; level++) {
        const next = await buildNextClass(
          current,
          subject.courses.find(c => c.level === level)
        );

        current = await ClassModel.scope(['defaultScope', 'countStudent']).findOne({
          where: {
            courseId: next.courseId,
            startDate: next.startDate
          },
          having: {
            numberOfRegistrations: {
              [Op.lt]: course.capacity
            }
          }
        });

        if (!current) {
          current = await next.save({ transaction: tx });
          ctx.logger.info(
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
      ctx.logger.error(err, 'fail to create class series');
      captureException(err);
      return null;
    }

    return series;
  }
};
