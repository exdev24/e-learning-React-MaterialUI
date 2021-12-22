import { ClassModel, StudentModel } from 'cl-models';
import { StudentIdVars } from '../../types';
import { catalogStore } from '../lib/dataloader';
import { GraphqlContext } from './index';

export default {
  course(c: ClassModel) {
    return c.course || catalogStore.getCourseById(c.courseId);
  },

  teacher(c: ClassModel) {
    return c.teacher || c.getTeacher();
  },

  async viewer(c: ClassModel, args: StudentIdVars, ctx: GraphqlContext) {
    if (!ctx.userId) {
      return null;
    }

    if (args.studentId) {
      return StudentModel.findOne({
        where: {
          id: args.studentId,
          parentId: ctx.userId
        }
      });
    }

    const students = await c.getStudents({
      where: {
        parentId: ctx.userId
      }
    });

    return students[0];
  }
};
