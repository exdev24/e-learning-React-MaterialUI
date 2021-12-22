import { Topic, tzOpts } from 'cl-common';
import {
  ArticleModel,
  ClassModel,
  CommentModel,
  CourseModel,
  CreditModel,
  PartnerModel,
  ProjectModel,
  PromotionModel,
  SessionModel,
  StudentModel,
  TeacherModel,
  ThreadModel,
  UserModel
} from 'cl-models';
import { DateTime } from 'luxon';
import { FindOptions, Op, QueryTypes } from 'sequelize';
import { listedTopics } from '../../shared/constants';
import { CourseIdVars, IDVars, QueryArgs } from '../../types';
import fetchFutureClasses from '../lib/class-query-helper';
import { getQualifiedClass } from '../lib/coupon-factory';
import { catalogStore } from '../lib/dataloader';
import { getUploadUrl } from '../lib/s3-utils';
import sequelize from '../sequelize';
import { GraphqlContext } from './index';

export default {
  async user(_, args: any, ctx: GraphqlContext) {
    if (ctx.userId) {
      return UserModel.scope('children').findByPk(ctx.userId, {
        include: [CreditModel]
      });
    }
  },

  async referer(_, args: QueryArgs.Referer) {
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
      subjects: await catalogStore.getSubjects([Topic.SN, Topic.AI, Topic.ROBO])
    };
  },

  student(_, args: IDVars, ctx: GraphqlContext) {
    if (ctx.userId) {
      return StudentModel.findOne({
        where: {
          id: args.id,
          parentId: ctx.userId
        }
      });
    }
  },

  maker(_, args: IDVars) {
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

  async articles(_, args: QueryArgs.Articles) {
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

  class(_, args: IDVars) {
    return ClassModel.scope(['defaultScope', 'countStudent']).findByPk(args.id, {
      rejectOnEmpty: true,
      include: [CourseModel]
    });
  },

  classes(_, args: QueryArgs.Classes) {
    return fetchFutureClasses(args);
  },

  classroom(_, args: IDVars, ctx: GraphqlContext) {
    return ClassModel.findByPk(args.id, {
      order: [
        [ThreadModel, 'createdAt', 'DESC'],
        [ThreadModel, CommentModel, 'createdAt', 'DESC']
      ],
      include: [
        TeacherModel,
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

  async rescheduleCandidates(_, args: CourseIdVars) {
    const course = await catalogStore.getCourseById(args.courseId);
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

  async addonCandidates(_, args: QueryArgs.AddonCandidates) {
    const course = await catalogStore.getCourseById(args.courseId);
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

  async promotion(_, args: QueryArgs.Promotion, ctx: GraphqlContext) {
    if (!ctx.userId) {
      return null;
    }

    const promo = await PromotionModel.findOne({
      where: {
        code: args.code.trim()
      }
    });

    if (!promo || !promo.isValid) {
      ctx.logger.warn('coupon %s has expired', args.code);
      ctx.badRequest('Invalid Coupon', {
        code: 'This coupon code has expired'
      });
    }

    if (promo.userId && promo.userId !== ctx.userId) {
      ctx.logger.warn('coupon %s can only be used by the owner', args.code);
      ctx.badRequest('Invalid Coupon', {
        code: 'Not authorized to use this coupon'
      });
    }

    if (promo.firstTimerOnly) {
      const user = await UserModel.findByPk(ctx.userId);
      if (!user || user.paid) {
        ctx.logger.warn('coupon %s can only be used by new user', args.code);
        ctx.badRequest('Invalid Coupon', {
          code: 'Not authorized to use this coupon'
        });
      }
    }

    if (promo.isLevelUp) {
      const course = await catalogStore.getCourseById(args.courseId);
      const qualified = await getQualifiedClass(ctx.userId, course);
      if (!qualified) {
        ctx.logger.warn('cannot find qualified class to redeem levelup coupon');
        ctx.badRequest('Invalid Coupon', {
          code: 'This coupon cannot be used for this class'
        });
      }
    }

    return promo;
  },

  subject(_, args: IDVars) {
    return catalogStore.getSubjectById(args.id);
  },

  async subjects(_, args: QueryArgs.Subjects) {
    return catalogStore.getSubjects(args.ids || listedTopics);
  },

  course(_, args: IDVars) {
    return catalogStore.getCourseById(args.id);
  },

  courses(_, args: QueryArgs.Courses) {
    return catalogStore.getCourses(args.ids);
  },

  partner(_, args: QueryArgs.Partner) {
    return PartnerModel.findOne({
      where: 'id' in args ? { id: args.id } : { code: args.code },
      include: [CourseModel]
    });
  },

  userUpload(_, args: QueryArgs.UserUpload, ctx: GraphqlContext) {
    ctx.assertAuthenticated();
    return getUploadUrl(ctx.userId, {
      name: args.name,
      type: args.type
    });
  },

  async project(_, args: IDVars, ctx: GraphqlContext) {
    const project = await ProjectModel.findByPk(args.id, {
      include: [StudentModel]
    });

    if (project && (project.published || project.student.parentId === ctx.userId)) {
      return project;
    }
  },

  async projects(_, args: QueryArgs.ListProjectVars) {
    const queryOpts: FindOptions = {
      order: [['featured', 'DESC']],
      include: [StudentModel]
    };

    if (args.featured) {
      queryOpts.where = {
        featured: {
          [Op.gt]: 0
        }
      };
    }
    if (args.subjectId) {
      queryOpts.where = {
        subjectId: args.subjectId
      };
    }

    if (args.limit > 0) {
      queryOpts.limit = args.limit;
    }
    if (args.offset > 0) {
      queryOpts.offset = args.offset;
    }

    if (!queryOpts.where) {
      queryOpts.where = {
        published: true
      };
    }

    return ProjectModel.findAll(queryOpts);
  }
};
