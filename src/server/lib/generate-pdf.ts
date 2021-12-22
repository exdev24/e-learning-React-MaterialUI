import { CourseModel, TeacherModel } from 'cl-models';
import * as path from 'path';
import PDFKit from 'pdfkit';

const printData: {
  [id: string]: {
    studentNameX: number;
    studentNameY: number;
    teacherNameX: number;
    teacherNameY: number;
    courseNameX?: number;
    courseNameY?: number;
  };
} = {
  'ai-explorers_1': {
    studentNameX: 196,
    studentNameY: 290,
    teacherNameX: 140,
    teacherNameY: 450
  },
  'ai-explorers_2': {
    studentNameX: 196,
    studentNameY: 290,
    teacherNameX: 120,
    teacherNameY: 450
  },
  'ai-explorers_3': {
    studentNameX: 196,
    studentNameY: 290,
    teacherNameX: 125,
    teacherNameY: 443
  },
  ascratch_1: {
    studentNameX: 196,
    studentNameY: 302,
    teacherNameX: 150,
    teacherNameY: 486
  },
  ascratch_2: {
    studentNameX: 196,
    studentNameY: 295,
    teacherNameX: 150,
    teacherNameY: 466
  },
  ascratch_3: {
    studentNameX: 196,
    studentNameY: 295,
    teacherNameX: 150,
    teacherNameY: 465
  },
  'data-science_1': {
    studentNameX: 196,
    studentNameY: 280,
    teacherNameX: 160,
    teacherNameY: 420
  },
  'data-science_2': {
    studentNameX: 196,
    studentNameY: 280,
    teacherNameX: 150,
    teacherNameY: 424
  },
  minecraft_1: {
    studentNameX: 196,
    studentNameY: 310,
    teacherNameX: 175,
    teacherNameY: 475
  },
  minecraft_2: {
    studentNameX: 196,
    studentNameY: 310,
    teacherNameX: 175,
    teacherNameY: 475
  },
  minecraft_3: {
    studentNameX: 196,
    studentNameY: 310,
    teacherNameX: 175,
    teacherNameY: 475
  },
  python_1: {
    studentNameX: 196,
    studentNameY: 280,
    teacherNameX: 115,
    teacherNameY: 435
  },
  python_2: {
    studentNameX: 196,
    studentNameY: 295,
    teacherNameX: 130,
    teacherNameY: 450
  },
  python_3: {
    studentNameX: 196,
    studentNameY: 295,
    teacherNameX: 135,
    teacherNameY: 450
  },
  robots_1: {
    studentNameX: 196,
    studentNameY: 255,
    teacherNameX: 154,
    teacherNameY: 434
  },
  robots_2: {
    studentNameX: 196,
    studentNameY: 270,
    teacherNameX: 140,
    teacherNameY: 432
  },
  robots_3: {
    studentNameX: 196,
    studentNameY: 270,
    teacherNameX: 145,
    teacherNameY: 432
  },
  scratch_1: {
    studentNameX: 196,
    studentNameY: 295,
    teacherNameX: 181,
    teacherNameY: 488
  },
  scratch_2: {
    studentNameX: 196,
    studentNameY: 295,
    teacherNameX: 165,
    teacherNameY: 488
  },
  scratch_3: {
    studentNameX: 196,
    studentNameY: 315,
    teacherNameX: 165,
    teacherNameY: 488
  },
  scratch_4: {
    studentNameX: 196,
    studentNameY: 315,
    teacherNameX: 188,
    teacherNameY: 488
  },
  web_1: {
    studentNameX: 196,
    studentNameY: 260,
    teacherNameX: 110,
    teacherNameY: 442
  },
  web_2: {
    studentNameX: 196,
    studentNameY: 260,
    teacherNameX: 110,
    teacherNameY: 442
  },
  web_3: {
    studentNameX: 196,
    studentNameY: 260,
    teacherNameX: 110,
    teacherNameY: 442
  },
  fallback: {
    studentNameX: 196,
    studentNameY: 280,
    teacherNameX: 105,
    teacherNameY: 444,
    courseNameX: 196,
    courseNameY: 385
  }
};

function adjustFontSizeForWidth(
  text: string,
  doc: PDFKit.PDFDocument,
  fontSize: number,
  maxWidth: number
): boolean {
  let adjusted = false;
  doc.fontSize(fontSize);
  while (doc.widthOfString(text) > maxWidth) {
    adjusted = false;
    fontSize = -1;
    doc.fontSize(fontSize);
  }
  return adjusted;
}

const fontPath = path.join(__dirname, '../../../public/font/Kollektif.ttf');

export function generateCertificatePdf(
  course: CourseModel,
  studentName: string,
  teacher?: TeacherModel
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // in case if there's no teacher, fill in the CEO
    const teacherName = teacher?.fullName || 'Jessie Jiang';

    // letter paper is 8.5" by 11"
    // PDF points are 72 per inch
    // so final letter PDF is 612 x 792 points

    const doc = new PDFKit({
      size: 'letter',
      layout: 'landscape',
      margin: 0
    });

    const pageWidth = 792;
    const pageHeight = 612;
    const textBlockWidth = 400;
    const lowerBlockWidth = 200;

    const chunks = [];

    // Write intermediate chunks of PDF to array, later to be joined and encoded.
    // This is done to skip writing to file, and keep all in memory.
    // But if the files becomes too big, it will be better to save to file.
    doc.on('data', function (chunk) {
      chunks.push(chunk);
    });

    const fileKey = course.id in printData ? course.id : 'fallback';
    const courseData = printData[fileKey];
    const bgFilePath = path.join(
      __dirname,
      `../../../public/certificate/${fileKey}.png`
    );

    doc.image(bgFilePath, 0, 0, {
      cover: [pageWidth, pageHeight],
      align: 'center'
    });

    doc.font(fontPath);

    doc.fillColor('#38b6ff');
    adjustFontSizeForWidth(studentName, doc, 50, textBlockWidth);

    doc.text(studentName, courseData.studentNameX, courseData.studentNameY, {
      width: textBlockWidth,
      height: 50,
      align: 'center'
    });
    doc.fillColor('black');
    doc.moveDown();

    if (fileKey === 'fallback') {
      doc.fillColor('#38b6ff');
      // adjust font to fit 3 lines
      adjustFontSizeForWidth(course.name, doc, 18, textBlockWidth);
      doc.text(course.name, courseData.courseNameX, courseData.courseNameY, {
        width: textBlockWidth,
        align: 'center'
      });
      doc.moveDown();
    }

    doc.fillColor('#38b6ff');
    adjustFontSizeForWidth(teacherName, doc, 18, lowerBlockWidth);
    doc.text(teacherName, courseData.teacherNameX, courseData.teacherNameY, {
      width: lowerBlockWidth,
      height: 20,
      align: 'center'
    });
    doc.fillColor('black');
    doc.moveDown();

    // once the stream has ended, resolve the promise with the file contents
    doc.on('end', () => {
      // sendgrid accepts files as base64 encoded strings
      resolve(Buffer.concat(chunks));
    });

    doc.on('error', reject);

    // end stream
    doc.end();
  });
}
