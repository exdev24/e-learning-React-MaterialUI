import { ClassModel, CourseModel, EnrollmentModel, StudentModel } from 'models';
import { sendRequestCertificateEmail } from '../emails/mailer';
import logger from '../lib/logger';

export async function requestCertificate(key: string): Promise<void> {
  const hash: string = typeof key === 'string' ? key : '';
  const decodedString = Buffer.from(hash, 'base64').toString('ascii');
  const [studentId, classId] = decodedString.split(':');
  const klass = await ClassModel.findOne({
    include: [
      {
        model: EnrollmentModel,
        required: true,
        where: {
          studentId: studentId
        },
        include: [
          {
            model: StudentModel,
            required: true
          }
        ]
      },
      CourseModel
    ],
    where: {
      id: classId
    }
  });

  if (!klass || klass.enrollments.length == 0) {
    logger.error(
      { studentId, classId },
      'Failed to get data for a certificate request! student:class pair not found'
    );
    return;
  }

  await sendRequestCertificateEmail(klass.enrollments[0].student, klass);
}
