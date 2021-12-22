import { tzOpts } from 'cl-common';
import csv from 'csv-parser';
import { DateTime } from 'luxon';
import { Readable } from 'stream';
import { PartnerImportClassData } from './types';

enum SheetColumn {
  CourseId = 'courseid',
  ClassId = 'classid',
  Teacher = 'teacher',
  Duration = 'duration',
  Dates = 'dates',
  Times = 'times'
}

const MAX_SESSIONS_COUNT = 25;
const MAX_CLASSES_COUNT = 50;

/**
 * Convert object keys to a common format by lowercasing and removing anything
 *   that is not a letter, to avoid case or spacing errors
 * Sanitize values by trimming spaces
 * @param data: object to sanitize
 */
function sanitizeData(data: { [key: string]: string }): { [key: string]: string } {
  return Object.keys(data).reduce(
    (c, k) => ((c[k.replace(/[^\w@]|_/gi, '').toLowerCase()] = data[k].trim()), c),
    {}
  );
}

/**
 * Convert duration in format h:m:s into number of minutes
 * @param str: duration encoded as string
 */
function parseDuration(str: string): number {
  const regex = /(\d{1,2})?:?(\d{1,2}):(\d{1,2})/g;

  const match = regex.exec(str);
  if (match !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [full, hours, minutes, seconds] = match;
    return (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
  }
  throw new Error(`Duration is in invalid format: ${str}`);
}

/**
 * Converts date and time strings in unknown format into DateTime object
 * @param date
 * @param time
 */
function parseDate(date: string, time: string): DateTime {
  const funcs = [
    (d: string) => DateTime.fromISO(d, tzOpts),
    (d: string) => DateTime.fromHTTP(d, tzOpts),
    (d: string) => DateTime.fromRFC2822(d, tzOpts),
    (d: string) => DateTime.fromFormat(d, 'M/d/y h:mm a', tzOpts),
    (d: string) => DateTime.fromFormat(d, 'M/d/y h:mm:ss a', tzOpts),
    (d: string) => DateTime.fromFormat(d, 'yyyy-MM-dd h:mm a', tzOpts),
    (d: string) => DateTime.fromFormat(d, 'yyyy-MM-dd h:mm:ss a', tzOpts)
  ];

  let dateTime: DateTime;
  for (let i = 0; i < funcs.length; i++) {
    const fn = funcs[i];
    dateTime = fn(`${date} ${time}`);
    if (!dateTime.invalidReason) break;
  }
  if (!dateTime || dateTime.invalidReason)
    throw new Error(`Invalid date or time format: ${date} ${time}`);
  return dateTime;
}

export default function partnerParseSchedulesFile(
  fileBuffer: Buffer
): Promise<PartnerImportClassData[]> {
  return new Promise((resolve, reject) => {
    const newStream = new Readable({
      read() {
        this.push(fileBuffer);
        this.push(null);
      }
    });

    // the code below will group rows by class ID, and sessions will be an array
    const results = new Map<string, PartnerImportClassData>();
    let prevClassId;

    newStream
      .pipe(csv())
      .on('data', (data: { [key: string]: string }) => {
        try {
          const sanitizedData = sanitizeData(data);

          // validate columns
          Object.values(SheetColumn).forEach(key => {
            if (sanitizedData[key] == undefined) {
              throw new Error(`Column ${key} does not exist in the sheet!`);
            }
          });

          // get class data: either use class from previous row, or create a new one
          const externalClassId = sanitizedData[SheetColumn.ClassId] || prevClassId;
          if (!externalClassId) {
            throw new Error(`Row has unknown class ID`);
          }

          let classData = results.get(externalClassId);
          if (!classData) {
            const courseId = sanitizedData[SheetColumn.CourseId];
            if (!courseId) throw new Error(`Row has unknown course ID`);
            const duration = sanitizedData[SheetColumn.Duration];
            if (!duration) throw new Error(`Row has unknown duration`);

            const teacherEmail = sanitizedData[SheetColumn.Teacher];
            if (!teacherEmail) throw new Error(`Row has unknown teacher`);
            classData = {
              courseId,
              externalClassId,
              teacherEmail,
              duration: parseDuration(duration),
              scheduleDateTime: []
            };
          }
          prevClassId = externalClassId;

          // add schedule data
          const date = sanitizedData[SheetColumn.Dates];
          if (!date) throw new Error(`Row has unknown date`);
          const time = sanitizedData[SheetColumn.Times];
          if (!time) throw new Error(`Row has unknown time`);

          classData.scheduleDateTime.push(parseDate(date, time));

          if (classData.scheduleDateTime.length > MAX_SESSIONS_COUNT)
            throw new Error(
              `Cannot create more than ${MAX_SESSIONS_COUNT} sessions per class!`
            );

          results.set(externalClassId, classData);
          if (results.size > MAX_CLASSES_COUNT)
            throw new Error(
              `Cannot create more than ${MAX_SESSIONS_COUNT} classes!`
            );
        } catch (e) {
          reject(e);
        }
      })
      .on('end', () => {
        resolve(Array.from(results.values()));
      })
      .on('error', reject);
  });
}
