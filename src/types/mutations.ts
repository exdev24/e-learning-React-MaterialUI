import { ClassIdVars, IDVars, StudentIdVars } from './common';
import { CountryCode } from 'libphonenumber-js/mobile';

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  email: string;
  passwordResetToken: string;
  password: string;
}

export interface SignIn {
  email: string;
  password: string;
}

export interface SignUp {
  email: string;
  password: string;
  name: string;
  countryCode?: CountryCode;
  phoneNumber?: string;
  inviter?: string;
  timezone: string;
  childName?: string;
  year?: number;
  classId?: string;
  campaign?: string;
  source?: string;
  landing?: string;
}

export interface EditProfile {
  email: string;
  firstName: string;
  lastName: string;
  countryCode?: CountryCode;
  phoneNumber?: string;
  referralCode: string;
  password: string;
  previous: string;
  timezone: string;
}

export interface AddStudent {
  childName: string;
  year?: number;
  school?: string;
  gender?: string;
  avatarFile?: string;
}

export interface EditStudent extends AddStudent, IDVars {
  coverFile?: string;
}

export interface EnrollTrial extends ClassIdVars, StudentIdVars {
  optIn?: boolean;
  campaign?: string;
  source?: string;
}

export interface EnrollClass extends StudentIdVars {
  classIds: string[];
  wholePackage?: boolean;
  credit?: number;
  paymentMethodNonce: string;
  promotionId?: string;
  campaign?: string;
  source?: string;
}

export type RescheduleEnrollment = IDVars &
  ClassIdVars & {
    idx?: number;
  };

export interface InviteFriend {
  email: string;
}

export interface AddProject extends StudentIdVars {
  published?: boolean;
  url: string;
  preview: string;
  title: string;
  description: string;
  subjectId?: string;
}

export type EditProject = Omit<AddProject, 'studentId'> & IDVars;

export interface AddThread extends ClassIdVars, StudentIdVars {
  content: string;
  attachments: string[];
}

export interface AddProjectThread extends ClassIdVars, StudentIdVars {
  url: string;
  preview: string;
  title: string;
  description: string;
  published?: boolean;
}

export interface AddComment extends StudentIdVars {
  threadId: string;
  content: string;
}

export interface GenerateCertification extends ClassIdVars, StudentIdVars {
  studentName: string;
}

export interface AddReaction {
  projectId: string;
  content: string;
}
