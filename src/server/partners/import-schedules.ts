import { Topic } from 'cl-common';
import { ClassModel, CourseModel, PartnerClassModel, TeacherModel } from 'cl-models';
import sequelize from '../sequelize';
import { createClass, updateClass } from './manage-classes';
import { PartnerImportClassData } from './types';

export async function partnerImportSchedules(classes: PartnerImportClassData[]) {
  const tx = await sequelize.transaction();

  try {
    const results = classes.map(async classData => {
      const teacher = await TeacherModel.findOne({
        where: {
          email: classData.teacherEmail
        },
        rejectOnEmpty: Error('Teacher not found')
      });
      const course = await CourseModel.findByPk(classData.courseId, {
        rejectOnEmpty: Error('Course not found')
      });

      if (course.subjectId !== Topic.PARTNERS) {
        throw Error(`cannot create classes for ${course.name}!`);
      }

      const schedules = preprocessSchedules(classData);
      // find existing class
      const externalId = `${classData.courseId}-${classData.externalClassId}`;
      const externalClass = await PartnerClassModel.findOne({
        where: {
          externalId
        }
      });

      let klass: ClassModel;

      if (externalClass) {
        klass = await updateClass(externalClass.classId, teacher, schedules, tx);
      } else {
        klass = await createClass(classData, teacher, schedules, tx);
        await PartnerClassModel.create(
          {
            classId: klass.id,
            externalId
          },
          {
            transaction: tx
          }
        );
      }

      klass.course = course;
      return klass;
    });

    const importedClasses = await Promise.all(results);

    await tx.commit();

    return importedClasses;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

function preprocessSchedules(classData: PartnerImportClassData): [Date, Date][] {
  return classData.scheduleDateTime
    .sort()
    .map(dt => [dt.toJSDate(), dt.plus({ minutes: classData.duration }).toJSDate()]);
}
