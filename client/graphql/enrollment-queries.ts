import gql from 'graphql-tag';
import { Promotion } from '../../types';
import {
  ClassLite,
  ClassWithCourse,
  ClassWithCourseFragment,
  Course,
  PromotionFragment,
  Subject,
  UserChildrenFragment,
  UserWithChildren
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
  mutation($classId: ID!, $studentId: ID!, $webinarOptIn: Boolean) {
    enrollTrial(
      classId: $classId
      studentId: $studentId
      webinarOptIn: $webinarOptIn
    ) {
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
      balanceInCents
      canEnrollTrial
    }
    klass: class(id: $id) {
      ...ClassWithCourseFragment
      isFull
      studentIds
      offer {
        ...PromotionFragment
      }
      course {
        subject {
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

export interface KlassWithOffer extends ClassLite {
  studentIds: string[];
  series?: ClassWithCourse[];
  offer?: Promotion;
  course: Course & {
    subject: Pick<Subject, 'name' | 'exitLevel'>;
  };
}

export interface GetUserWithClassResponse {
  user: UserWithChildren & {
    balanceInCents: number;
    canEnrollTrial: boolean;
  };
  klass: KlassWithOffer;
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
