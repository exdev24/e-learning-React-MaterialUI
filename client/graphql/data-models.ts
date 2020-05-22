import { Topic } from 'common';
import gql from 'graphql-tag';
import { Author, CourseIdVars, IDVars, SubjectIdVars } from '../../types';

export interface Subject {
  id: Topic;
  name: string;
  headline: string;
  blurb: string;
  banner: string;
  thumbnail: string;
  exitLevel: number;
}

export const SubjectFragment = gql`
  fragment SubjectFragment on Subject {
    id
    name
    headline
    blurb
    banner
    thumbnail
    exitLevel
  }
`;

export interface Course extends IDVars, SubjectIdVars {
  name: string;
  description: string;
  price: number;
  level: number;
  duration: number;
  grades: [number, number];
  thumbnail: string;
  isTrial: boolean;
  info?: string;
  recording?: string;
}

export const CourseFragment = gql`
  fragment CourseFragment on Course {
    id
    subjectId
    name
    description
    price
    level
    grades
    duration
    thumbnail
    isTrial
    recording
    info
  }
`;

export interface SubjectWithCourses extends Subject {
  courses: Course[];
}

export const SubjectWithCoursesFragment = gql`
  ${SubjectFragment}
  ${CourseFragment}
  fragment SubjectWithCoursesFragment on Subject {
    ...SubjectFragment
    courses {
      ...CourseFragment
    }
  }
`;

export interface CourseWithSubject extends Course {
  subject: Subject;
}

export const CourseWithSubjectFragment = gql`
  ${SubjectFragment}
  ${CourseFragment}
  fragment CourseWithSubjectFragment on Course {
    ...CourseFragment
    subject {
      ...SubjectFragment
    }
  }
`;

export interface ClassBase extends IDVars, CourseIdVars {
  startDate: string;
  endDate: string;
  schedules: [string, string][];
}

export const ClassBaseFragment = gql`
  fragment ClassBaseFragment on Class {
    id
    courseId
    startDate
    endDate
    schedules
  }
`;

export interface ClassLite extends ClassBase {
  isFull: boolean;
  isWeekly: boolean;
  isCamp: boolean;
}
export const ClassLiteFragment = gql`
  ${ClassBaseFragment}
  fragment ClassLiteFragment on Class {
    ...ClassBaseFragment
    isCamp
    isFull
    isWeekly
  }
`;

export interface RegisteredClass extends ClassBase {
  dialInLink: string;
  isCamp: boolean;
}
export const RegisteredClassFragment = gql`
  ${ClassBaseFragment}
  fragment RegisteredClassFragment on Class {
    ...ClassBaseFragment
    isCamp
    dialInLink
  }
`;

export interface ClassWithCourse extends ClassBase {
  course: Course;
}
export const ClassWithCourseFragment = gql`
  ${ClassBaseFragment}
  ${CourseFragment}
  fragment ClassWithCourseFragment on Class {
    ...ClassBaseFragment
    course {
      ...CourseFragment
    }
  }
`;

export interface Seat extends IDVars {
  idx: number;
  startDate: string;
  endDate: string;
  added?: boolean;
  attended?: boolean;
  class: RegisteredClass & {
    teacher: {
      id: string;
      fullName: string;
      avatar: string;
    };
  };
}

export interface Registration {
  id: string;
  seats: Seat[];
  class: RegisteredClass & {
    course: Pick<Course, 'id' | 'name' | 'price'>;
  };
}

export const RegistrationFragment = gql`
  ${RegisteredClassFragment}
  fragment RegistrationFragment on Registration {
    id
    seats {
      id
      idx
      startDate
      endDate
      added
      attended
      class {
        ...RegisteredClassFragment
        teacher {
          id
          fullName
          avatar
        }
      }
    }
    class {
      ...RegisteredClassFragment
      course {
        id
        name
        price
      }
    }
  }
`;

export interface User extends IDVars {
  email: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  braintreeToken: string;
  timezone: string;
}

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    email
    firstName
    lastName
    referralCode
    braintreeToken
    timezone
  }
`;

export interface Student extends IDVars {
  name: string;
  school: string;
  gender: string;
  year?: number;
  age?: number;
  avatar: string;
  cover: string;
  webinar?: boolean;
}

export const ChildFragment = gql`
  fragment ChildFragment on Student {
    id
    name
    school
    gender
    year
    age
    avatar
    cover
    webinar
  }
`;

export interface UserWithChildren extends User {
  children: Student[];
}

export const UserChildrenFragment = gql`
  ${UserFragment}
  ${ChildFragment}
  fragment UserChildrenFragment on User {
    ...UserFragment
    children {
      ...ChildFragment
    }
  }
`;

export const PromotionFragment = gql`
  fragment PromotionFragment on Promotion {
    id
    amount
    amountInPackage
    code
    description
    type
  }
`;

export interface Project {
  id: string;
  published?: boolean;
  url: string;
  preview: string;
  title: string;
  description: string;
  subject?: Pick<Subject, 'id' | 'name'>;
}

export const ProjectFragment = gql`
  fragment ProjectFragment on Project {
    id
    published
    url
    preview
    title
    description
    subject {
      id
      name
    }
  }
`;

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
}

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    id
    content
    createdAt
    author {
      id
      name
      avatar
    }
  }
`;

export interface Thread {
  id: string;
  content: string;
  createdAt: string;
  comments: Comment[];
  attachments: string[];
  author: Author;
}

export const ThreadFragment = gql`
  ${CommentFragment}
  fragment ThreadFragment on Thread {
    id
    content
    createdAt
    attachments
    author {
      id
      name
      avatar
    }
    comments {
      ...CommentFragment
    }
  }
`;

export interface Classroom extends IDVars {
  startDate: string;
  endDate: string;
  dialInLink: string;
  course: Course;
  threads: Thread[];
  students: IDVars[];
  teacher?: {
    avatar: string;
    email: string;
    fullName: string;
  };
}

export const ClassroomFragment = gql`
  ${CourseFragment}
  ${ThreadFragment}
  fragment ClassroomFragment on Classroom {
    id
    startDate
    endDate
    dialInLink
    course {
      ...CourseFragment
    }
    students {
      id
    }
    teacher {
      avatar
      email
      fullName
    }
    threads {
      ...ThreadFragment
    }
  }
`;
