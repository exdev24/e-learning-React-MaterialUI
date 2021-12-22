import { Topic } from 'cl-common';
import { LinkProps } from 'next/link';
import urlJoin from 'url-join';
import { routeIds, routePrefixes } from '../../shared/constants';
import { ClassBase, Student } from '../graphql/data-models';
import { baseUrl } from '../runtime';

export function getSiteUrl(pathname: string): string {
  return urlJoin(baseUrl, pathname);
}

export function getReferralUrl(code: string) {
  return getSiteUrl(routePrefixes.ref + encodeURIComponent(code));
}

export function getTopicLink(
  subjectId: Topic,
  opts?: Partial<{ courseId: string; hideTrial: boolean }>
): LinkProps {
  return {
    href: routeIds.topic,
    as: {
      pathname: routePrefixes.topic + subjectId,
      hash: opts?.courseId
    }
  };
}

export function getEnrollLink(
  klass: ClassBase,
  opts: { wholePackage?: boolean }
): LinkProps {
  return opts.wholePackage
    ? {
        href: routeIds.enrollPackage,
        as: routePrefixes.enrollPackage + klass.id
      }
    : {
        href: routeIds.enrollClass,
        as: routePrefixes.enrollClass + klass.id
      };
}

export function getClassroomLink(
  klass: ClassBase,
  student: Pick<Student, 'id' | 'name'>
): LinkProps {
  return {
    href: routeIds.classroom,
    as: {
      pathname: routePrefixes.classroom + [klass.id, student.id].join('/')
    }
  };
}

export function getMyClassesLink(student: Pick<Student, 'id' | 'name'>): LinkProps {
  return {
    href: routePrefixes.myClasses + '[sid]',
    as: routePrefixes.myClasses + student.id
  };
}

export function getMyProjectsLink(student: Pick<Student, 'id' | 'name'>): LinkProps {
  return {
    href: routePrefixes.myProjects + '[sid]',
    as: routePrefixes.myProjects + student.id
  };
}

export function getMakerLink(student: Pick<Student, 'id' | 'name'>): LinkProps {
  return {
    href: routeIds.maker,
    as: routePrefixes.maker + student.id
  };
}
