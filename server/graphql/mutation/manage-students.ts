import Boom from 'boom';
import { StudentModel } from 'models';
import { Request } from 'express';
import { nanoid } from 'nanoid';
import { IDVars, MutationArgs } from '../../../types';
import { uploadFile } from '../../lib/s3-utils';
import sequelize from '../../sequelize';

function getImageFileName(prefix: string, student: StudentModel) {
  return [prefix, nanoid(4), student.name].join('_');
}

export async function addStudent(root, args: MutationArgs.AddStudent, req: Request) {
  if (!req.userId) {
    throw Boom.unauthorized('You must login first');
  }

  const { childName, year, gender, avatarFile, ...details } = args;

  const [student, created] = await StudentModel.findOrCreate({
    where: {
      parentId: req.userId,
      name: childName.trim()
    },
    defaults: {
      parentId: req.userId,
      name: childName,
      year,
      gender,
      details
    }
  });

  if (!created) {
    throw Boom.badRequest('Duplicate name', {
      childName: `${childName} is already on file`
    });
  }

  if (avatarFile) {
    const uploadResult = await uploadFile(req.userId, {
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
  root,
  args: MutationArgs.EditStudent,
  req: Request
) {
  if (!req.userId) {
    throw Boom.unauthorized('You must login first');
  }

  const student = await StudentModel.findByPk(args.id, {
    rejectOnEmpty: true
  });

  if (student.parentId !== req.userId) {
    throw Boom.unauthorized('You can only edit your own child');
  }

  const details = { ...student.details, school: args.school };

  if (args.avatarFile) {
    const uploadResult = await uploadFile(req.userId, {
      name: getImageFileName('avatar', student),
      content: args.avatarFile
    });
    details.avatar = uploadResult.fileUrl;
  }

  if (args.coverFile) {
    const uploadResult = await uploadFile(req.userId, {
      name: getImageFileName('cover', student),
      content: args.coverFile
    });
    details.cover = uploadResult.fileUrl;
  }

  student.set('details', details);
  student.set('name', args.childName);
  if (args.gender) {
    student.set('gender', args.gender);
  }
  if (args.year) {
    student.set('year', args.year);
  }

  await student.save();
  return student;
}

export async function removeStudent(root, args: IDVars, req: Request) {
  if (!req.userId) {
    throw Boom.unauthorized('You must login first');
  }

  const student = await StudentModel.findByPk(args.id);
  if (!student || student.parentId !== req.userId) {
    throw Boom.unauthorized('student not under your account');
  }

  const tx = await sequelize.transaction();

  try {
    await student.destroy({ transaction: tx });
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }

  return true;
}
