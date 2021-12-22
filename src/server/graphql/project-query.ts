import { ProjectModel, UserModel } from 'cl-models';
import { catalogStore } from '../lib/dataloader';
import { GraphqlContext } from '.';

export default {
  subject(p: ProjectModel) {
    if (p.subject) {
      return p.subject;
    }

    if (p.subjectId) {
      return catalogStore.getSubjectById(p.subjectId);
    }
  },

  async isOwner(p: ProjectModel, _, ctx: GraphqlContext) {
    const student = p.student || (await p.getStudent());
    return ctx.userId === student.parentId;
  },

  async reactions(p: ProjectModel) {
    return p.getReactions({
      order: [['createdAt', 'DESC']],
      limit: 99,
      include: [UserModel]
    });
  }
};
