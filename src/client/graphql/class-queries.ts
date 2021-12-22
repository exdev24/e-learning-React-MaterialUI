import gql from 'graphql-tag';
import {
  ClassLite,
  ClassLiteFragment,
  ProjectFragment,
  ProjectWithStudent
} from './data-models';

export const GetUpcomingClassesQuery = gql`
  ${ClassLiteFragment}
  query($subjectId: ID, $courseId: ID) {
    classes(subjectId: $subjectId, courseId: $courseId) {
      ...ClassLiteFragment
    }
  }
`;

export type ClassesWithProjectListResult = {
  classes: ClassLite[];
  projects: ProjectWithStudent[];
};

export const GetClassesWithProjectsQuery = gql`
  ${ClassLiteFragment}
  ${ProjectFragment}
  query($subjectId: ID, $courseId: ID, $offset: Int, $limit: Int) {
    classes(subjectId: $subjectId, courseId: $courseId) {
      ...ClassLiteFragment
    }
    projects(subjectId: $subjectId, offset: $offset, limit: $limit) {
      ...ProjectFragment
      student {
        id
        name
        avatar
      }
    }
  }
`;

export const RescheduleCandidatesQuery = gql`
  ${ClassLiteFragment}
  query($courseId: ID!) {
    classes: rescheduleCandidates(courseId: $courseId) {
      ...ClassLiteFragment
    }
  }
`;

export type ClassListResult = {
  classes: ClassLite[];
};

export const AddonCandidatesQuery = gql`
  query($courseId: ID!, $idx: Int!) {
    sessions: addonCandidates(courseId: $courseId, idx: $idx) {
      id
      startDate
      endDate
      classId
    }
  }
`;
export type SessionsListResult = {
  sessions: {
    id: string;
    startDate: string;
    endDate: string;
    classId: string;
  }[];
};
