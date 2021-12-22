import {
  ClassModel,
  CommentModel,
  ProjectModel,
  StudentModel,
  ThreadModel
} from 'cl-models';
import { FindOptions } from 'sequelize';
import { filterXSS } from 'xss';
import { ClassIdVars, IDVars, MutationArgs, StudentIdVars } from '../../../types';
import { catalogStore } from '../../lib/dataloader';
import sequelize from '../../sequelize';
import { GraphqlContext } from '../index';

async function getStudentWithPermission(
  ctx: GraphqlContext,
  opts: StudentIdVars & Partial<ClassIdVars>
) {
  ctx.assertAuthenticated();

  const cond: FindOptions = {
    where: {
      id: opts.studentId,
      parentId: ctx.userId
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
    throw ctx.unauthorized('Not authorized');
  }

  return student;
}

export async function addThread(
  _,
  args: MutationArgs.AddThread,
  ctx: GraphqlContext
) {
  const student = await getStudentWithPermission(ctx, {
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

  ctx.logger.info(
    { classId: thread.classId, threadId: thread.id },
    '%s started a thread',
    student.firstName
  );

  return thread;
}

export async function addProjectThread(
  _,
  args: MutationArgs.AddProjectThread,
  ctx: GraphqlContext
) {
  const student = await getStudentWithPermission(ctx, {
    classId: args.classId,
    studentId: args.studentId
  });

  const course = await catalogStore.getCourseById(student.classes[0].courseId);
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

    ctx.logger.info(
      { classId: thread.classId, threadId: thread.id },
      '%s started a project thread',
      student.firstName
    );

    return thread;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

export async function deleteThread(_, args: IDVars, ctx: GraphqlContext) {
  ctx.assertAuthenticated();

  const thread = await ThreadModel.findByPk(args.id, {
    rejectOnEmpty: true
  });

  if (!thread.studentId) {
    ctx.unauthorized('You can only delete your own comment');
  }

  const student = await StudentModel.unscoped().findOne({
    where: {
      id: thread.studentId,
      parentId: ctx.userId
    }
  });

  if (student) {
    ctx.logger.info(
      { classId: thread.classId, threadId: thread.id },
      '%s deleted a thread',
      student.firstName
    );

    await thread.destroy();
  }

  return true;
}

export async function addComment(
  _,
  args: MutationArgs.AddComment,
  ctx: GraphqlContext
) {
  const student = await getStudentWithPermission(ctx, {
    studentId: args.studentId
  });

  const comment = await CommentModel.create({
    threadId: args.threadId,
    studentId: student.id,
    content: args.content
  });

  comment.student = student;

  ctx.logger.info(
    { threadId: comment.threadId },
    '%s added a comment',
    student.name
  );

  return comment;
}

export async function deleteComment(_, args: IDVars, ctx: GraphqlContext) {
  const comment = await CommentModel.findByPk(args.id, {
    rejectOnEmpty: true
  });

  if (!comment.studentId) {
    ctx.unauthorized('You can only delete your own comment');
  }

  const student = await getStudentWithPermission(ctx, {
    studentId: comment.studentId
  });

  if (student) {
    ctx.logger.info(
      { threadId: comment.threadId },
      '%s deleted a comment',
      student.name
    );

    await comment.destroy();
  }

  return true;
}
