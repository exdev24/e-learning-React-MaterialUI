import { ProjectModel, ReactionModel, StudentModel } from 'cl-models';
import { IDVars, MutationArgs } from '../../../types';
import { GraphqlContext } from '../index';

export async function addProject(
  _,
  args: MutationArgs.AddProject,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const { subjectId, studentId, published, ...details } = args;
  const student = await StudentModel.findOne({
    rejectOnEmpty: true,
    where: {
      id: studentId,
      parentId: ctx.userId
    }
  });

  const project = await ProjectModel.create({
    subjectId: subjectId || null,
    studentId,
    published,
    details
  });

  ctx.logger.info('%s added project %s', student.name, project.title);

  return project;
}

export async function editProject(
  _,
  args: MutationArgs.EditProject,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const { id, subjectId, published, ...details } = args;
  const project = await ProjectModel.findByPk(id, {
    rejectOnEmpty: true
  });

  const student = await StudentModel.findOne({
    rejectOnEmpty: true,
    where: {
      id: project.studentId,
      parentId: ctx.userId
    }
  });

  await project.update({
    subjectId: subjectId || null,
    published,
    details
  });

  ctx.logger.info('%s updated project %s', student.name, project.title);

  return project;
}

export async function deleteProject(_, args: IDVars, ctx: GraphqlContext) {
  ctx.assertAuthenticated();

  const project = await ProjectModel.findByPk(args.id, {
    rejectOnEmpty: true
  });

  const student = await StudentModel.findOne({
    rejectOnEmpty: true,
    where: {
      id: project.studentId,
      parentId: ctx.userId
    }
  });

  ctx.logger.info('%s deleted project %s', student.name, project.title);

  await project.destroy();
  return true;
}

export async function addReaction(
  _,
  args: MutationArgs.AddReaction,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  return ReactionModel.create({
    userId: ctx.userId,
    projectId: args.projectId,
    content: args.content
  });
}

export async function deleteReaction(_, args: IDVars, ctx: GraphqlContext) {
  ctx.assertAuthenticated();

  const reaction = await ReactionModel.findByPk(args.id);
  if (reaction.userId === ctx.userId) {
    await reaction.destroy();
    return true;
  }

  return false;
}
