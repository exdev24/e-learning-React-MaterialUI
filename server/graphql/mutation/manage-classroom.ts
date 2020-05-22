import Boom from 'boom';
import {
  ClassModel,
  CommentModel,
  ProjectModel,
  StudentModel,
  ThreadModel
} from 'models';
import { Request } from 'express';
import { FindOptions } from 'sequelize';
import { filterXSS } from 'xss';
import { ClassIdVars, IDVars, MutationArgs, StudentIdVars } from '../../../types';
import { getCourse } from '../../lib/catalog-cache';
import logger from '../../lib/logger';
import sequelize from '../../sequelize';

async function getStudentWithPermission(
  req: Request,
  opts: StudentIdVars & Partial<ClassIdVars>
) {
  if (!req.userId) {
    throw Boom.unauthorized();
  }

  const cond: FindOptions = {
    where: {
      id: opts.studentId,
      parentId: req.userId
    }
  };

  if (opts.classId) {
    cond.include = [
      {
        model: ClassModel.unscoped(),
        required: true,
        where: {
          id: opts.classId
        }
      }
    ];
  }

  const student = await StudentModel.unscoped().findOne(cond);
  if (!student) {
    throw Boom.unauthorized();
  }

  return student;
}

export async function addThread(
  root: any,
  args: MutationArgs.AddThread,
  req: Request
) {
  const student = await getStudentWithPermission(req, {
    classId: args.classId,
    studentId: args.studentId
  });

  const thread = await ThreadModel.create({
    classId: args.classId,
    studentId: args.studentId,
    details: {
      content: filterXSS(args.content),
      attachments: args.attachments
    }
  });

  thread.student = student;
  thread.comments = [];

  logger.info(
    { classId: thread.classId, threadId: thread.id, userId: req.userId },
    '%s started a thread',
    student.firstName
  );

  return thread;
}

export async function addProjectThread(
  root: any,
  args: MutationArgs.AddProjectThread,
  req: Request
) {
  const student = await getStudentWithPermission(req, {
    classId: args.classId,
    studentId: args.studentId
  });

  const course = getCourse(student.classes[0]);
  const tx = await sequelize.transaction();

  try {
    const project = await ProjectModel.create(
      {
        subjectId: course.subjectId,
        studentId: student.id,
        published: args.published === true,
        details: {
          url: args.url.trim(),
          preview: args.preview,
          title: args.title,
          description: filterXSS(args.description)
        }
      },
      { transaction: tx }
    );

    const content = `
      <h3>${args.title}</h3>
      <p><a href="${project.url}" target="_blank">${project.url}</a></p>
      ${project.description}
    `;

    const thread = await ThreadModel.create(
      {
        classId: args.classId,
        studentId: args.studentId,
        projectId: project.id,
        details: {
          content: content.trim(),
          attachments: [project.preview]
        }
      },
      { transaction: tx }
    );

    await tx.commit();

    thread.student = student;
    thread.comments = [];

    logger.info(
      { classId: thread.classId, threadId: thread.id, userId: req.userId },
      '%s started a project thread',
      student.firstName
    );

    return thread;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

export async function deleteThread(root: any, args: IDVars, req: Request) {
  if (!req.userId) {
    throw Boom.unauthorized();
  }

  const thread = await ThreadModel.findByPk(args.id, {
    rejectOnEmpty: true
  });

  if (thread.studentId) {
    const student = await StudentModel.unscoped().findOne({
      where: {
        id: thread.studentId,
        parentId: req.userId
      }
    });

    if (student) {
      logger.info(
        { classId: thread.classId, threadId: thread.id, userId: req.userId },
        '%s deleted a thread',
        student.firstName
      );

      await thread.destroy();
    }
  } else {
    throw Boom.forbidden('You can only delete your own thread');
  }

  return true;
}

export async function addComment(
  root: any,
  args: MutationArgs.AddComment,
  req: Request
) {
  const student = await getStudentWithPermission(req, {
    studentId: args.studentId
  });

  const comment = await CommentModel.create({
    threadId: args.threadId,
    studentId: student.id,
    content: args.content
  });

  comment.student = student;

  logger.info(
    { threadId: comment.threadId, userId: req.userId },
    '%s added a comment',
    student.name
  );

  return comment;
}

export async function deleteComment(root: any, args: IDVars, req: Request) {
  const comment = await CommentModel.findByPk(args.id, {
    rejectOnEmpty: true
  });

  if (comment.studentId) {
    const student = await getStudentWithPermission(req, {
      studentId: comment.studentId
    });

    if (student) {
      logger.info(
        { threadId: comment.threadId, userId: req.userId },
        '%s deleted a comment',
        student.name
      );

      await comment.destroy();
    }
  } else {
    throw Boom.forbidden('You can only delete your own comment');
  }

  return true;
}
