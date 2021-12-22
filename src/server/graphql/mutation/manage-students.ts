import { StudentModel } from 'cl-models';
import { nanoid } from 'nanoid';
import { IDVars, MutationArgs } from '../../../types';
import { uploadFile } from '../../lib/s3-utils';
import sequelize from '../../sequelize';
import { GraphqlContext } from '../index';

function getImageFileName(prefix: string, student: StudentModel) {
  return [prefix, nanoid(4), student.name].join('_');
}

export async function addStudent(
  _,
  args: MutationArgs.AddStudent,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const { childName, year, gender, avatarFile, ...details } = args;

  const [student, created] = await StudentModel.findOrCreate({
    where: {
      parentId: ctx.userId,
      name: childName.trim()
    },
    defaults: {
      parentId: ctx.userId,
      name: childName.trim(),
      year,
      gender,
      details
    }
  });

  if (!created) {
    ctx.badRequest('Duplicate name', {
      childName: `${childName} is already on file`
    });
  }

  if (avatarFile) {
    const uploadResult = await uploadFile(ctx.userId, {
      name: getImageFileName('avatar', student),
      content: args.avatarFile
    });

    await student.update({
      'details.avatar': uploadResult.fileUrl
    });
  }

  return student;
}

export async function editStudent(
  _,
  args: MutationArgs.EditStudent,
  ctx: GraphqlContext
) {
  ctx.assertAuthenticated();

  const student = await StudentModel.findOne({
    rejectOnEmpty: true,
    where: {
      id: args.id,
      parentId: ctx.userId
    }
  });

  const details = { ...student.details, school: args.school };

  if (args.avatarFile) {
    const uploadResult = await uploadFile(ctx.userId, {
      name: getImageFileName('avatar', student),
      content: args.avatarFile
    });
    details.avatar = uploadResult.fileUrl;
  }

  if (args.coverFile) {
    const uploadResult = await uploadFile(ctx.userId, {
      name: getImageFileName('cover', student),
      content: args.coverFile
    });
    details.cover = uploadResult.fileUrl;
  }

  student.set('details', details);
  student.set('name', args.childName.trim());
  if (args.gender) {
    student.set('gender', args.gender);
  }
  if (args.year) {
    student.set('year', args.year);
  }

  await student.save();
  return student;
}

export async function removeStudent(_, args: IDVars, ctx: GraphqlContext) {
  ctx.assertAuthenticated();

  const student = await StudentModel.findOne({
    rejectOnEmpty: true,
    where: {
      id: args.id,
      parentId: ctx.userId
    }
  });

  const tx = await sequelize.transaction();

  try {
    await student.destroy({ transaction: tx });
    ctx.logger.info(
      { studentId: args.id, mutation: 'removeStudent' },
      'student deleted'
    );
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }

  return true;
}
