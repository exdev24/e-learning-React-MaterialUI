import gql from 'graphql-tag';
import {
  ClassLite,
  ClassLiteFragment,
  Course,
  CourseFragment,
  CourseWithSubject,
  CourseWithSubjectFragment,
  SubjectWithCourses,
  SubjectWithCoursesFragment
} from './data-models';

export const GetCourseQuery = gql`
  ${CourseWithSubjectFragment}
  query($id: ID!) {
    course(id: $id) {
      ...CourseWithSubjectFragment
    }
  }
`;

export interface GetCourseQueryResult {
  course: CourseWithSubject;
}

export const GetSubjectQuery = gql`
  ${SubjectWithCoursesFragment}
  query($id: ID!) {
    subject(id: $id) {
      ...SubjectWithCoursesFragment
    }
  }
`;

export interface GetSubjectQueryResult {
  subject: SubjectWithCourses;
}

export const SubjectListQuery = gql`
  ${SubjectWithCoursesFragment}
  query($ids: [ID]) {
    subjects(ids: $ids) {
      ...SubjectWithCoursesFragment
    }
  }
`;

export interface SubjectListQueryResult {
  subjects: SubjectWithCourses[];
}

export const CourseListQuery = gql`
  ${CourseFragment}
  ${ClassLiteFragment}
  query($ids: [ID]!, $camps: Boolean) {
    courses(ids: $ids) {
      ...CourseFragment
      upcomingClasses(camps: $camps) {
        ...ClassLiteFragment
      }
    }
  }
`;

export interface CourseWithClasses extends Course {
  upcomingClasses: ClassLite[];
}

export interface CourseListResult {
  courses: CourseWithClasses[];
}

export const PartnerQuery = gql`
  ${CourseFragment}
  ${ClassLiteFragment}
  query($code: String!) {
    partner(code: $code) {
      id
      name
      slogan
      summary
      bannerImage
      courses {
        ...CourseFragment
        upcomingClasses {
          ...ClassLiteFragment
        }
      }
    }
  }
`;

export interface PartnerQueryResult {
  partner: {
    id: string;
    name: string;
    slogan: string;
    summary: string;
    bannerImage: string;
    courses: CourseWithClasses[];
  };
}
