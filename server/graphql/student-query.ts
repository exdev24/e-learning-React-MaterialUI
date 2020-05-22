import {
  AttendanceModel,
  ClassModel,
  SessionModel,
  StudentModel,
  SubjectModel,
  TeacherModel
} from 'models';
import { Request } from 'express';
import { Op } from 'sequelize';
import { getRecommendations } from '../lib/recommendations';

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
  async parent(s: StudentModel, args: any, req: Request) {
    if (req.userId === s.parentId) {
      return s.parent || s.getParent();
    } else {
      return null;
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
