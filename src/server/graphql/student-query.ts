import { Topic } from 'cl-common';
import {
  AttendanceModel,
  ClassModel,
  CourseModel,
  SessionModel,
  StudentModel,
  SubjectModel,
  TeacherModel
} from 'cl-models';
import { Op } from 'sequelize';
import { ClassIdVars } from '../../types';
import { getRecommendations } from '../lib/recommendations';
import { GraphqlContext } from './index';

interface Seat {
  id: string;
  idx: number;
  class: ClassModel;
  startDate: Date;
  endDate: Date;
  added?: boolean;
  attended?: boolean;
}

export default {
  webinar(s: StudentModel) {
    return s.optIns[Topic.WEBINARS];
  },

  pe(s: StudentModel) {
    return s.optIns[Topic.PE];
  },

  async parent(s: StudentModel, _, ctx: GraphqlContext) {
    if (ctx.userId === s.parentId) {
      return s.parent || s.getParent();
    }
  },

  async projects(s: StudentModel) {
    return s.getProjects({
      order: [['createdAt', 'DESC']],
      include: [SubjectModel]
    });
  },

  async recommendations(s: StudentModel) {
    const history = s.classes || (await s.getClasses());
    return getRecommendations(s, history);
  },

  async registrations(s: StudentModel, args: { upcoming: boolean }) {
    const enrollments = await s.getEnrollments({
      order: [
        [ClassModel, 'startDate', 'DESC'],
        [ClassModel, SessionModel, 'idx', 'ASC']
      ],
      include: [
        {
          model: ClassModel,
          include: [TeacherModel],
          where: args.upcoming
            ? {
                endDate: { [Op.gt]: new Date() }
              }
            : null
        }
      ]
    });

    const addons = await s.getAddons({
      order: [
        [ClassModel, 'startDate', 'DESC'],
        [ClassModel, SessionModel, 'idx', 'ASC']
      ],
      include: [
        {
          model: ClassModel,
          include: [TeacherModel]
        }
      ]
    });

    const attendances = await AttendanceModel.findAll({
      where: {
        studentId: s.id
      }
    });

    return enrollments.map(er => {
      const seats: Seat[] = er.class.sessions.map(ses => {
        const addon = addons.find(
          addon => addon.originalClassId === ses.classId && addon.idx === ses.idx
        );

        if (addon) {
          ses = addon.class.sessions[ses.idx];
        }

        const attendance = attendances.find(att => att.sessionId === ses.id);

        return {
          id: ses.id + s.id,
          idx: ses.idx,
          class: addon ? addon.class : er.class,
          startDate: ses.startDate,
          endDate: ses.endDate,
          added: !!addon,
          attended: attendance ? attendance.attended : null
        };
      });

      return {
        id: er.id,
        class: er.class,
        seats
      };
    });
  },

  async enrollStats(s: StudentModel, args: ClassIdVars) {
    const enrollments = await s.getEnrollments({
      include: [
        {
          model: ClassModel.unscoped(),
          include: [CourseModel]
        }
      ]
    });

    let hasEnrolled = false;
    let futureTrials = 0;
    let attendedTrials = 0;

    const historical: string[] = [];

    for (const er of enrollments) {
      if (er.classId === args.classId) {
        hasEnrolled = true;
      }

      if (er.class.course.isTrial) {
        if (er.statusCode > 0) {
          attendedTrials++;
        } else if (er.class.startDate > new Date()) {
          futureTrials++;
        }
      } else if (er.class.course.isRegular) {
        historical.push(er.class.courseId);
      }
    }

    return {
      id: s.id,
      hasEnrolled,
      futureTrials,
      attendedTrials,
      historical
    };
  },

  async enrolled(s: StudentModel, args: ClassIdVars) {
    const klasses = await s.getClasses({
      scope: false,
      where: {
        id: args.classId
      }
    });

    return klasses.length > 0;
  },

  async enrollments(s: StudentModel) {
    return s.getEnrollments({
      order: [[ClassModel, 'startDate', 'DESC']],
      include: [
        {
          model: ClassModel,
          include: [TeacherModel]
        }
      ]
    });
  }
};
