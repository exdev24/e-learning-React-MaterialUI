import { ClassModel, CourseModel, SubjectModel } from 'models';
import logger from './logger';

const courseStore = new Map<string, CourseModel>();
const subjectStore = new Map<string, SubjectModel>();

const cacheTTL = 15 * 60 * 1000; // 15 minutes

export function getCourse(klass: ClassModel): CourseModel {
  return klass.course || getCourseById(klass.courseId);
}

export function getCourseById(cid: string): CourseModel {
  return courseStore.get(cid);
}

export function getSubject(course: CourseModel): SubjectModel {
  return course.subject || getSubjectById(course.subjectId);
}

export function getSubjectById(sid: string): SubjectModel {
  return subjectStore.get(sid);
}

export function getSubjects(sids: string[]): SubjectModel[] {
  return sids.map(sid => subjectStore.get(sid));
}

export function getTrialCourseIds() {
  const ids: string[] = [];
  for (const course of courseStore.values()) {
    if (course.isTrial) {
      ids.push(course.id);
    }
  }

  return ids;
}

let cacheTimerId: NodeJS.Timeout;

export async function cacheWarmup() {
  await refill();
  process.on('SIGTERM', () => {
    logger.info('system shutdown, clear timer');
    if (cacheTimerId) {
      clearTimeout(cacheTimerId);
    }
  });
}

async function refill() {
  const results = await SubjectModel.findAll({
    order: [
      [CourseModel, 'level', 'ASC'],
      [CourseModel, 'createdAt', 'DESC']
    ],
    include: [CourseModel]
  });

  for (const subject of results) {
    subjectStore.set(subject.id, subject);
    for (const course of subject.courses) {
      courseStore.set(course.id, course);
    }
  }

  logger.info('cache refreshed');
  setTimeout(refill, cacheTTL);
}
