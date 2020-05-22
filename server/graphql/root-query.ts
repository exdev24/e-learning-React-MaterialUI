import Boom from 'boom';
import { Topic, tzOpts } from 'common';
import {
  ArticleModel,
  ClassModel,
  CommentModel,
  CourseModel,
  EnrollmentModel,
  PartnerModel,
  ProjectModel,
  PromotionModel,
  SessionModel,
  StudentModel,
  TeacherModel,
  ThreadModel,
  UserModel
} from 'models';
import { Request } from 'express';
import { DateTime } from 'luxon';
import { FindOptions, Op, QueryTypes } from 'sequelize';
import { listedTopics } from '../../shared/constants';
import { CourseIdVars, IDVars, QueryArgs } from '../../types';
import { getCourseById, getSubjectById, getSubjects } from '../lib/catalog-cache';
import fetchFutureClasses from '../lib/class-query-helper';
import { getQualifiedClass } from '../lib/coupon-factory';
import { createLogger } from '../lib/logger';
import { getUploadUrl } from '../lib/s3-utils';
import sequelize from '../sequelize';

export default {
  async user(root, args, req: Request) {
    return req.userId ? UserModel.scope('children').findByPk(req.userId) : null;
  },

  async referer(root, args: QueryArgs.Referer) {
    const user = await UserModel.findOne({
      rejectOnEmpty: true,
      where: {
        referralCode: args.code
      }
    });

    return {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      referralCode: user.referralCode,
      subjects: getSubjects([Topic.SN, Topic.AI, Topic.ROBO])
    };
  },

  student(root, args: IDVars, req: Request) {
    if (req.userId) {
      return StudentModel.findOne({
        where: {
          id: args.id,
          parentId: req.userId
        }
      });
    }
  },

  maker(root, args: IDVars) {
    return StudentModel.findByPk(args.id, {
      order: [[ProjectModel, 'createdAt', 'DESC']],
      include: [
        {
          model: ProjectModel,
          required: false,
          where: {
            published: true
          }
        }
      ]
    });
  },

  async articlesStats() {
    return sequelize.query<{ month: Date; count: number }>(
      `SELECT last_day(createdAt) month, count(id) count
      FROM ${ArticleModel.tableName}
      WHERE published = $1 AND createdAt < $2
      GROUP BY month
      ORDER BY month DESC`,
      {
        type: QueryTypes.SELECT,
        bind: [true, new Date()]
      }
    );
  },

  async articles(root, args: QueryArgs.Articles) {
    const queryOpts: FindOptions = {
      order: [['createdAt', 'DESC']]
    };

    if (args.limit > 0) {
      queryOpts.limit = args.limit;
    }
    if (args.offset > 0) {
      queryOpts.offset = args.offset;
    }

    const now = new Date();

    if (args.selectedMonth) {
      const dt = DateTime.fromISO(args.selectedMonth, tzOpts);
      const start = dt.startOf('month').toJSDate();
      const end = dt.endOf('month').toJSDate();

      if (start < now) {
        queryOpts.where = {
          published: true,
          createdAt: {
            [Op.gte]: start,
            [Op.lte]: end > now ? now : end
          }
        };
      }
    }

    if (!queryOpts.where) {
      queryOpts.where = {
        published: true,
        createdAt: {
          [Op.lt]: now
        }
      };
    }

    return ArticleModel.findAll(queryOpts);
  },

  class(root: any, args: IDVars) {
    return ClassModel.scope(['defaultScope', 'countStudent']).findByPk(args.id, {
      rejectOnEmpty: true,
      include: [EnrollmentModel]
    });
  },

  classes(root: any, args: QueryArgs.Classes) {
    return fetchFutureClasses(args);
  },

  classroom(root: any, args: QueryArgs.Classroom, req: Request) {
    if (!req.userId) {
      throw Boom.unauthorized();
    }

    return ClassModel.findByPk(args.id, {
      order: [
        [ThreadModel, 'createdAt', 'DESC'],
        [ThreadModel, CommentModel, 'createdAt', 'DESC']
      ],
      include: [
        CourseModel,
        TeacherModel,
        {
          model: StudentModel.unscoped(),
          required: true,
          where: args.studentId
            ? { id: args.studentId, parentId: req.userId }
            : { parentId: req.userId }
        },
        {
          model: ThreadModel,
          include: [
            StudentModel.unscoped(),
            TeacherModel,
            {
              model: CommentModel,
              include: [StudentModel.unscoped(), TeacherModel]
            }
          ]
        }
      ]
    });
  },

  async rescheduleCandidates(root: any, args: CourseIdVars) {
    const course = getCourseById(args.courseId);
    return ClassModel.scope(['defaultScope', 'countStudent']).findAll({
      order: [['startDate', 'ASC']],
      where: {
        active: true,
        courseId: args.courseId,
        startDate: {
          [Op.gt]: new Date()
        }
      },
      having: {
        numberOfRegistrations: {
          [Op.lt]: course.capacity
        }
      }
    });
  },

  async addonCandidates(root: any, args: QueryArgs.AddonCandidates) {
    const course = getCourseById(args.courseId);
    if (!course.isRegular) {
      return [];
    }

    const sessions = await SessionModel.findAll({
      order: [
        ['startDate', 'ASC'],
        [ClassModel, SessionModel, 'idx', 'ASC']
      ],
      where: {
        idx: args.idx,
        startDate: {
          [Op.gt]: new Date()
        }
      },
      include: [
        {
          model: StudentModel.unscoped(),
          required: true,
          attributes: ['id']
        },
        {
          model: ClassModel,
          required: true,
          where: {
            active: true,
            courseId: args.courseId
          }
        }
      ]
    });

    return sessions.filter(
      ses => ses.students.length < course.capacity && ses.class.sessions.length === 4
    );
  },

  async promotion(root, args: QueryArgs.Promotion, req: Request) {
    if (!req.userId) {
      return null;
    }

    const fLogger = createLogger('PromotionQuery', { userId: req.userId });
    const promo = await PromotionModel.findOne({
      where: {
        code: args.code.trim()
      }
    });

    if (!promo || !promo.isValid) {
      fLogger.warn('coupon %s has expired', args.code);
      throw Boom.badRequest('Invalid Coupon', {
        code: 'This coupon code has expired'
      });
    }

    if (promo.userId && promo.userId !== req.userId) {
      fLogger.warn('coupon %s can only be used by the owner', args.code);
      throw Boom.badRequest('Invalid Coupon', {
        code: 'Not authorized to use this coupon'
      });
    }

    if (promo.firstTimerOnly) {
      const user = await UserModel.findByPk(req.userId);
      if (!user || user.paid) {
        fLogger.warn('coupon %s can only be used by new user', args.code);
        throw Boom.badRequest('Invalid Coupon', {
          code: 'Not authorized to use this coupon'
        });
      }
    }

    if (promo.isLevelUp) {
      const qualified = await getQualifiedClass(
        req.userId,
        getCourseById(args.courseId)
      );
      if (!qualified) {
        fLogger.warn('cannot find qualified class to redeem levelup coupon');
        throw Boom.badRequest('Invalid Coupon', {
          code: 'This coupon cannot be used for this class'
        });
      }
    }

    return promo;
  },

  subject(root, args: IDVars) {
    return getSubjectById(args.id);
  },

  subjects(root, args: QueryArgs.Subjects) {
    return getSubjects(args.ids || listedTopics);
  },

  course(root, args: IDVars) {
    return getCourseById(args.id);
  },

  courses(root, args: QueryArgs.Courses) {
    return args.ids.map(id => getCourseById(id));
  },

  partner(root, args: QueryArgs.Partner) {
    return PartnerModel.findOne({
      rejectOnEmpty: true,
      where: 'id' in args ? { id: args.id } : { code: args.code },
      include: [CourseModel]
    });
  },

  userUpload(root, args: QueryArgs.UserUpload, req: Request) {
    if (!req.userId) {
      throw Boom.unauthorized('Requires login');
    }

    return getUploadUrl(req.userId, {
      name: args.name,
      type: args.type
    });
  }
};
