import gql from 'graphql-tag';
import {
  ChildFragment,
  Course,
  CourseFragment,
  Project,
  ProjectFragment,
  Registration,
  RegistrationFragment,
  Student,
  Subject,
  SubjectFragment,
  User,
  UserChildrenFragment,
  UserFragment,
  UserWithChildren
} from './data-models';

export interface UserChildrenResponse {
  user: UserWithChildren | null;
}

export const GetUserChildrenQuery = gql`
  ${UserChildrenFragment}
  query {
    user {
      ...UserChildrenFragment
    }
  }
`;

export interface UserWithCreditsResponse {
  user: User & {
    balanceInCents: number;
    credits: { id: string; cents: number; reason: string }[];
  };
}

export const GetUserWithCreditsQuery = gql`
  ${UserFragment}
  query {
    user {
      ...UserFragment
      balanceInCents
      credits {
        id
        cents
        reason
      }
    }
  }
`;

export const EditProfileMutation = gql`
  ${UserFragment}
  mutation(
    $email: String
    $firstName: String
    $lastName: String
    $password: String
    $previous: String
    $referralCode: String
    $timezone: String
  ) {
    editProfile(
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      previous: $previous
      referralCode: $referralCode
      timezone: $timezone
    ) {
      ...UserFragment
    }
  }
`;

export const AddStudentMutation = gql`
  ${ChildFragment}
  mutation(
    $childName: String!
    $school: String
    $gender: Gender
    $year: Int
    $avatarFile: String
  ) {
    student: addStudent(
      childName: $childName
      school: $school
      gender: $gender
      year: $year
      avatarFile: $avatarFile
    ) {
      ...ChildFragment
    }
  }
`;

export const EditStudentMutation = gql`
  ${ChildFragment}
  mutation(
    $id: ID!
    $childName: String!
    $school: String
    $gender: Gender
    $year: Int
    $avatarFile: String
    $coverFile: String
  ) {
    student: editStudent(
      id: $id
      childName: $childName
      school: $school
      gender: $gender
      year: $year
      avatarFile: $avatarFile
      coverFile: $coverFile
    ) {
      ...ChildFragment
    }
  }
`;

export const RemoveStudentMutation = gql`
  mutation($id: ID!) {
    removeStudent(id: $id)
  }
`;

export const SignInMutation = gql`
  ${UserChildrenFragment}
  mutation($email: String!, $password: String!) {
    user: signIn(email: $email, password: $password) {
      ...UserChildrenFragment
    }
  }
`;

export const SignUpMutation = gql`
  ${UserChildrenFragment}

  mutation(
    $email: String!
    $password: String!
    $name: String!
    $campaign: String
    $source: String
    $landing: String
    $inviter: String
    $timezone: String
    $childName: String
    $classId: ID
    $year: Int
  ) {
    user: signUp(
      email: $email
      password: $password
      name: $name
      campaign: $campaign
      source: $source
      landing: $landing
      inviter: $inviter
      timezone: $timezone
      childName: $childName
      year: $year
      classId: $classId
    ) {
      ...UserChildrenFragment
    }
  }
`;

export interface StudentRegistrationsResult {
  student: Student & { registrations: Registration[] };
}

export const StudentRegistrationsQuery = gql`
  ${ChildFragment}
  ${RegistrationFragment}
  query($id: ID!) {
    student(id: $id) {
      ...ChildFragment
      registrations {
        ...RegistrationFragment
      }
    }
  }
`;

export interface StudentSummary extends Student {
  registrations: Registration[];
  recommendations: Course[];
}

export interface UserSummaryResult {
  user: User & {
    children: StudentSummary[];
  };
}

export const UserSummaryQuery = gql`
  ${UserChildrenFragment}
  ${CourseFragment}
  ${RegistrationFragment}
  query {
    user {
      ...UserChildrenFragment
      children {
        registrations(upcoming: true) {
          ...RegistrationFragment
        }
        recommendations {
          ...CourseFragment
        }
      }
    }
  }
`;

export interface StudentProjectsResult {
  student: Student & {
    projects: Project[];
  };
}

export const StudentProjectsQuery = gql`
  ${ChildFragment}
  ${ProjectFragment}
  query($id: ID!) {
    student(id: $id) {
      ...ChildFragment
      projects {
        ...ProjectFragment
      }
    }
  }
`;

export interface MakerProfileResult {
  maker: Student & {
    projects: Project[];
  };
}

export const MakerProfileQuery = gql`
  ${ProjectFragment}
  query($id: ID!) {
    maker(id: $id) {
      id
      name
      school
      gender
      year
      age
      avatar
      cover
      projects {
        ...ProjectFragment
      }
    }
  }
`;

export const AddProjectMutation = gql`
  ${ProjectFragment}
  mutation(
    $published: Boolean
    $url: String!
    $preview: String!
    $title: String!
    $description: String!
    $subjectId: ID
    $studentId: ID!
  ) {
    addProject(
      published: $published
      url: $url
      preview: $preview
      title: $title
      description: $description
      subjectId: $subjectId
      studentId: $studentId
    ) {
      ...ProjectFragment
    }
  }
`;

export const EditProjectMutation = gql`
  ${ProjectFragment}
  mutation(
    $id: ID!
    $published: Boolean
    $url: String!
    $preview: String!
    $title: String!
    $description: String!
    $subjectId: ID
  ) {
    editProject(
      id: $id
      published: $published
      url: $url
      preview: $preview
      title: $title
      description: $description
      subjectId: $subjectId
    ) {
      ...ProjectFragment
    }
  }
`;

export const InviteFriendMutation = gql`
  mutation($email: String!) {
    inviteFriend(email: $email)
  }
`;

export interface RefererInfoData {
  referer: Pick<User, 'id' | 'email' | 'firstName'> & {
    subjects: Subject[];
  };
}

export const RefererInfoQuery = gql`
  ${SubjectFragment}
  query($code: String!) {
    referer(code: $code) {
      id
      email
      firstName
      subjects {
        ...SubjectFragment
      }
    }
  }
`;
