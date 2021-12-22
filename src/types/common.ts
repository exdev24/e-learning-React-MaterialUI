import { CouponType, Topic } from 'cl-common';

export interface IDVars {
  id: string;
}

export interface ClassIdVars {
  classId: string;
}

export interface CourseIdVars {
  courseId: string;
}

export interface SubjectIdVars {
  subjectId: Topic;
}

export interface StudentIdVars {
  studentId: string;
}

export interface Author extends IDVars {
  name: string;
  avatar?: string;
}

export interface Promotion extends IDVars {
  code: string;
  amount: number;
  amountInPackage: number;
  type: CouponType;
  description: string;
}

export type Deeplink = Partial<{
  coupon: string;
  name: string;
  email: string;
}>;
