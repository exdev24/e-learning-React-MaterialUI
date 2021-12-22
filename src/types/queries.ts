import { Topic } from 'cl-common';
import { CourseIdVars, IDVars, SubjectIdVars } from './common';

export interface Subjects {
  ids?: Topic[];
}

export interface Courses {
  ids: string[];
}

export interface Articles {
  limit?: number;
  offset?: number;
  selectedMonth?: string;
}

export interface Promotion extends CourseIdVars {
  code: string;
}

export type Partner =
  | IDVars
  | {
      code: string;
    };

export type Classes = Partial<CourseIdVars & SubjectIdVars & { camps: boolean }>;

export interface Referer {
  code: string;
}

export interface AddonCandidates extends CourseIdVars {
  idx: number;
}

export interface UserUpload {
  name: string;
  type: string;
}

export interface ListProjectVars {
  offset?: number;
  limit?: number;
  subjectId?: Topic;
  featured?: boolean;
}
