import gql from 'graphql-tag';
import { Promotion } from '../../types';
import {
  ClassWithCourse,
  ClassWithCourseFragment,
  Course,
  PromotionFragment,
  Student,
  Subject,
  User,
  UserChildrenFragment
} from './data-models';

export const RedeemCouponQuery = gql`
  ${PromotionFragment}
  query($code: String!, $courseId: ID!) {
    promotion(code: $code, courseId: $courseId) {
      ...PromotionFragment
    }
  }
`;

export const EnrollTrialMutation = gql`
  mutation($classId: ID!, $studentId: ID!, $optIn: Boolean) {
    enrollTrial(classId: $classId, studentId: $studentId, optIn: $optIn) {
      id
      studentId
    }
  }
`;

export const EnrollClassMutation = gql`
  mutation(
    $classIds: [ID]!
    $studentId: ID!
    $paymentMethodNonce: String!
    $promotionId: ID
    $credit: Int
    $wholePackage: Boolean
  ) {
    enrollClass(
      classIds: $classIds
      studentId: $studentId
      paymentMethodNonce: $paymentMethodNonce
      promotionId: $promotionId
      credit: $credit
      wholePackage: $wholePackage
    ) {
      id
      studentId
    }
  }
`;

export const GetUserWithClassQuery = gql`
  ${ClassWithCourseFragment}
  ${PromotionFragment}
  ${UserChildrenFragment}
  query($id: ID!) {
    user {
      ...UserChildrenFragment
      paid
      balanceInCents
      children {
        pe
        webinar
        enrollStats(classId: $id) {
          id
          hasEnrolled
          futureTrials
          attendedTrials
          historical
        }
      }
    }
    klass: class(id: $id) {
      ...ClassWithCourseFragment
      seats
      offer {
        ...PromotionFragment
      }
      course {
        subject {
          id
          name
          exitLevel
        }
      }
      series {
        ...ClassWithCourseFragment
      }
    }
  }
`;

export interface KlassWithOffer extends ClassWithCourse {
  seats: number;
  series?: ClassWithCourse[];
  offer?: Promotion;
  course: Course & {
    subject: Pick<Subject, 'id' | 'name' | 'exitLevel'>;
  };
}

export interface ChildWithEnrollStats extends Student {
  webinar?: boolean;
  pe?: boolean;
  enrollStats: {
    id: string;
    hasEnrolled: boolean;
    futureTrials: number;
    attendedTrials: number;
    historical: string[];
  };
}

export interface GetUserWithClassResponse {
  klass: KlassWithOffer;
  user: User & {
    paid: boolean;
    balanceInCents: number;
    children: ChildWithEnrollStats[];
  };
}

export const CancelEnrollmentMutation = gql`
  mutation($id: ID!) {
    cancelEnrollment(id: $id)
  }
`;

export const RescheduleEnrollmentMutation = gql`
  mutation($id: ID!, $classId: ID!, $idx: Int) {
    rescheduleEnrollment(id: $id, classId: $classId, idx: $idx) {
      id
    }
  }
`;
