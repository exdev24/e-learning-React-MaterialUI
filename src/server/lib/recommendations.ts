import { Topic } from 'cl-common';
import { ClassModel, CourseModel, StudentModel } from 'cl-models';
import { catalogStore } from './dataloader';

const optionsByAge: Record<number, Topic[]> = {
  7: [Topic.SN, Topic.JROBO],
  8: [Topic.SN, Topic.JROBO],
  9: [Topic.SN, Topic.AI, Topic.JROBO, Topic.DESIGN, Topic.MOBILE, Topic.DS],
  10: [Topic.SN, Topic.AI, Topic.ROBO, Topic.DESIGN, Topic.MOBILE, Topic.DS],
  11: [
    Topic.AS,
    Topic.AI,
    Topic.ROBO,
    Topic.DESIGN,
    Topic.MOBILE,
    Topic.MC,
    Topic.DS,
    Topic.WEB,
    Topic.PY,
    Topic.JAVA
  ],
  12: [
    Topic.AS,
    Topic.AI,
    Topic.ROBO,
    Topic.DESIGN,
    Topic.MOBILE,
    Topic.MC,
    Topic.DS,
    Topic.WEB,
    Topic.PY,
    Topic.JAVA
  ],
  13: [
    Topic.AS,
    Topic.AI,
    Topic.ROBO,
    Topic.MC,
    Topic.DS,
    Topic.WEB,
    Topic.PY,
    Topic.JAVA,
    Topic.BIO
  ],
  14: [Topic.AS, Topic.MC, Topic.WEB, Topic.PY, Topic.JAVA, Topic.BIO],
  15: [Topic.PY, Topic.MC, Topic.WEB, Topic.JAVA, Topic.BIO]
};

export function isCodingType(subjectId: Topic) {
  return [Topic.SN, Topic.AS, Topic.MC, Topic.MOBILE, Topic.PY, Topic.JAVA].includes(
    subjectId
  );
}

export async function getRecommendations(
  student: StudentModel,
  history: ClassModel[]
) {
  let hasDoneCoding = false;
  const suppress = new Map<string, number>();

  for (const cls of history) {
    const { subjectId, level } = await catalogStore.getCourseById(cls.courseId);
    if (!hasDoneCoding && isCodingType(subjectId)) {
      hasDoneCoding = true;
    }

    if (!suppress.has(subjectId) || suppress.get(subjectId) < level) {
      suppress.set(subjectId, level);

      // don't recommend scratch or accelerated scratch if student has done one of it
      if (subjectId === Topic.SN) {
        suppress.set(Topic.AS, level);
      } else if (subjectId === Topic.AS) {
        suppress.set(Topic.SN, level);
      }
    }
  }

  const topics = optionsByAge[student.age] || [Topic.SN, Topic.AI];
  const result: CourseModel[] = [];

  for (const subjectId of topics) {
    const subject = await catalogStore.getSubjectById(subjectId);

    if (suppress.has(subjectId)) {
      const finalLevel = suppress.get(subjectId);
      if (finalLevel < subject.exitLevel) {
        result.push(subject.courses.find(c => c.level === finalLevel + 1));
      }

      continue;
    }

    if (hasDoneCoding && isCodingType(subjectId)) {
      continue;
    }

    result.push(subject.courses.find(c => c.level === 1));
  }

  return result;
}
