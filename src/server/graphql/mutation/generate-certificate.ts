import { ClassModel, CourseModel, StudentModel, TeacherModel } from 'cl-models';
import { MutationArgs } from '../../../types';
import { generateCertificatePdf } from '../../lib/generate-pdf';
import { sendRequestCertificateEmailWithPdf } from '../../lib/mailer';
import { getRecommendations } from '../../lib/recommendations';

export async function generateCertificate(
  _,
  args: MutationArgs.GenerateCertification
) {
  const klass = await ClassModel.findByPk(args.classId, {
    rejectOnEmpty: true,
    include: [CourseModel, TeacherModel]
  });

  const student = await StudentModel.findByPk(args.studentId, {
    rejectOnEmpty: true,
    include: [ClassModel]
  });

  if (args.studentName && student.name !== args.studentName) {
    await student.update({
      name: args.studentName.trim()
    });
  }

  const certificate = await generateCertificatePdf(
    klass.course,
    args.studentName,
    klass.teacher
  );

  await sendRequestCertificateEmailWithPdf(
    student,
    klass,
    certificate.toString('base64')
  );

  return getRecommendations(student, student.classes);
}
