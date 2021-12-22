import {
  ClassModel,
  CourseModel,
  SeatModel,
  SessionModel,
  StudentModel,
  TeacherModel
} from 'cl-models';
import { Application } from 'express';
import { format } from 'url';
import { generateCertificatePdf } from '../lib/generate-pdf';
import logger from '../lib/logger';

export function handleRequestCertificate(app: Application) {
  app.get<null, null, null, { key: string }>(
    '/request-certificate',
    async (req, res) => {
      const decodedString = Buffer.from(req.query.key || '', 'base64').toString(
        'ascii'
      );

      const [studentId, classId] = decodedString.split(':');
      const seat = await SeatModel.findOne({
        where: {
          studentId
        },
        include: [
          StudentModel.unscoped(),
          {
            model: SessionModel,
            where: {
              classId
            }
          }
        ]
      });

      if (!seat) {
        logger.error(req.query, 'bad certificate key');
        return res.redirect('/');
      }

      res.redirect(
        format({
          pathname: '/course-certificate',
          query: {
            classId,
            studentId,
            studentName: seat.student.name
          }
        })
      );
    }
  );
}

export function handleRequestPrintCertificate(app: Application) {
  app.get<{ classId: string; studentId: string }>(
    '/print-certificate/:studentId/:classId',
    async (req, res, next) => {
      try {
        const student = await StudentModel.findByPk(req.params.studentId, {
          rejectOnEmpty: true
        });

        const klass = await ClassModel.findByPk(req.params.classId, {
          rejectOnEmpty: true,
          include: [CourseModel, TeacherModel]
        });

        const certificate = await generateCertificatePdf(
          klass.course,
          student.name,
          klass.teacher
        );
        res.setHeader('content-type', 'application/pdf');
        res.setHeader('content-disposition', 'inline; filename="certificate.pdf"');
        res.end(certificate);
      } catch (err) {
        next(err);
      }
    }
  );
}
