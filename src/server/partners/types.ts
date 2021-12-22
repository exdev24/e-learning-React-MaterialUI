import { DateTime } from 'luxon';

export interface PartnerImportClassData {
  courseId: string;
  externalClassId: string;
  teacherEmail: string;
  duration: number;
  scheduleDateTime: DateTime[];
}
