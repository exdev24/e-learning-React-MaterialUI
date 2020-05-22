import Boom from 'boom';
import { ProjectModel, StudentModel } from 'models';
import { Request } from 'express';
import { IDVars, MutationArgs } from '../../../types';
import { getSubjectById } from '../../lib/catalog-cache';
import logger from '../../lib/logger';

function assertOwnership(studentId: string, userId: string) {
  if (!userId) {
    throw Boom.unauthorized('Login required');
  }

  return StudentModel.findOne({
    rejectOnEmpty: true,
    where: {
      id: studentId,
      parentId: userId
    }
  });
}

export async function addProject(root, args: MutationArgs.AddProject, req: Request) {
  const { subjectId, studentId, published, ...details } = args;
  const student = await assertOwnership(studentId, req.userId);
  const project = await ProjectModel.create({
    subjectId: subjectId || null,
    studentId,
    published,
    details
  });

  logger.info(
    { userId: student.parentId },
    '%s added project %s',
    student.name,
    project.title
  );

  if (project.subjectId) {
    project.subject = getSubjectById(project.subjectId);
  }

  return project;
}

export async function editProject(
  root,
  args: MutationArgs.EditProject,
  req: Request
) {
  const { id, subjectId, published, ...details } = args;
  const project = await ProjectModel.findByPk(id, {
    rejectOnEmpty: true
  });

  const student = await assertOwnership(project.studentId, req.userId);
  await project.update({
    subjectId: subjectId || null,
    published,
    details
  });

  logger.info(
    { userId: student.parentId },
    '%s updated project %s',
    student.name,
    project.title
  );

  if (project.subjectId) {
    project.subject = getSubjectById(project.subjectId);
  }

  return project;
}

export async function deleteProject(root, args: IDVars, req: Request) {
  const project = await ProjectModel.findByPk(args.id, {
    rejectOnEmpty: true
  });
  await assertOwnership(project.studentId, req.userId);
  await project.destroy();
  return true;
}
