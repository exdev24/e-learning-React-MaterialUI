import { Topic } from 'cl-common';
import { Course } from '../graphql/data-models';
import { ChildWithEnrollStats } from '../graphql/enrollment-queries';

export function isOldEnough(
  course: Course,
  params: { birthYear?: number; age?: number }
) {
  let age = params.age;
  if (params.birthYear > 0) {
    age = new Date().getFullYear() - params.birthYear;
  }

  if (age > 0) {
    return age - 5 >= course.grades[0];
  }

  // not provided
  return true;
}

export function isAgeEnforced(course: Course) {
  return course.subjectId === Topic.SN && course.level < 2;
}

export function hasTrialQuota(user: {
  paid: boolean;
  children: ChildWithEnrollStats[];
}) {
  let futureTrials = 0;
  let attendedTrials = 0;

  for (const child of user.children) {
    futureTrials += child.enrollStats.futureTrials;
    attendedTrials += child.enrollStats.attendedTrials;
  }

  const quota = 1 + user.children.length;
  if (futureTrials >= quota) {
    return false;
  }

  return user.paid || attendedTrials < quota;
}

// taken 2+ paid classes at before
export function whitelistedForRobot(children: ChildWithEnrollStats[]) {
  return (
    children.reduce(
      (total, child) => total + child.enrollStats.historical.length,
      0
    ) >= 2
  );
}
