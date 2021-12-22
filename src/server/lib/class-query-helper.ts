import { campClassMaxDays, tzOpts } from 'cl-common';
import { ClassModel, CourseModel, SessionModel } from 'cl-models';
import { DateTime } from 'luxon';
import { Includeable, Op, WhereOptions } from 'sequelize';
import { QueryArgs } from '../../types';

export default async function queryUpcomingClasses(args: QueryArgs.Classes) {
  const local = DateTime.local();

  const include: Includeable[] = [];
  const where: WhereOptions = {
    active: true,
    startDate: {
      [Op.gte]: local.plus({ minutes: 30 }).toJSDate(),
      [Op.lte]: local.plus({ weeks: 8 }).toJSDate()
    }
  };

  if (args.camps) {
    where.days = {
      [Op.gte]: 2,
      [Op.lt]: campClassMaxDays
    };
  }

  if (args.courseId) {
    include.push({
      model: CourseModel,
      where: {
        id: args.courseId
      }
    });
  } else if (args.subjectId) {
    include.push({
      model: CourseModel,
      where: {
        subjectId: args.subjectId,
        level: {
          [Op.gte]: 0
        }
      }
    });
  } else {
    include.push(CourseModel);
  }

  let klasses = await ClassModel.scope(['defaultScope', 'countStudent']).findAll({
    order: [['startDate', 'ASC']],
    include,
    where
  });

  const trialCutoff = local.plus({ hours: 6 }).toJSDate();
  const paidCutoff = local.plus({ days: 2 }).toJSDate();

  klasses = klasses.filter(k => {
    if (k.sessions.length === 0) {
      // bad metadata
      return false;
    }

    if (k.numberOfRegistrations === 0) {
      if (k.course.isTrial && k.startDate < trialCutoff) {
        return false;
      } else if (k.course.isRegular && k.startDate < paidCutoff) {
        return false;
      }
    }

    return true;
  });

  if (args.courseId && klasses.length > 5) {
    let hasOpen = false;
    klasses = klasses.filter(k => {
      if (k.numberOfRegistrations >= k.course.capacity) {
        return hasOpen;
      }

      hasOpen = true;
      return true;
    });
  }

  return klasses;
}

export async function buildNextClass(current: ClassModel, course: CourseModel) {
  const schedules = await buildSchedules(current, course.duration);
  return new ClassModel(
    {
      courseId: course.id,
      startDate: schedules[0][0],
      endDate: schedules[schedules.length - 1][1],
      details: {
        createdBy: 'portal:bundle',
        reason: current.id
      },
      sessions: schedules.map((ses, idx) => ({
        idx,
        startDate: ses[0],
        endDate: ses[1]
      }))
    },
    { include: [SessionModel] }
  );
}

async function buildSchedules(klass: ClassModel, minutes: number) {
  const weekdays: number[] = [];
  const startDates: DateTime[] = [];
  for (const ses of klass.sessions) {
    const dt = DateTime.fromJSDate(ses.startDate, tzOpts).set({
      second: 0,
      millisecond: 0
    });
    weekdays.push(dt.get('weekday'));
    startDates.push(dt);
  }

  if (await klass.isWeekly()) {
    let dts = startDates[startDates.length - 1];
    return klass.sessions.map(() => {
      dts = dts.plus({ week: 1 });
      return [dts.toJSDate(), dts.plus({ minutes }).toJSDate()];
    });
  }

  // pattern 1: 1/3/5
  if (
    (weekdays[0] === 1 && weekdays[1] === 3) ||
    (weekdays[0] === 3 && weekdays[1] === 5) ||
    (weekdays[0] === 5 && weekdays[1] === 1)
  ) {
    let dts = startDates[startDates.length - 1];
    return weekdays.map(weekday => {
      dts = dts.plus({ days: weekday === 5 ? 3 : 2 });
      return [dts.toJSDate(), dts.plus({ minutes }).toJSDate()];
    });
  }

  // pattern 2: 2/4/6
  if (
    (weekdays[0] === 2 && weekdays[1] === 4) ||
    (weekdays[0] === 4 && weekdays[1] === 6) ||
    (weekdays[0] === 6 && weekdays[1] === 2)
  ) {
    let dts = startDates[startDates.length - 1];
    return weekdays.map(weekday => {
      dts = dts.plus({ days: weekday === 6 ? 3 : 2 });
      return [dts.toJSDate(), dts.plus({ minutes }).toJSDate()];
    });
  }

  // pattern 3: 2/4/7
  if (
    (weekdays[0] === 2 && weekdays[1] === 4) ||
    (weekdays[0] === 4 && weekdays[1] === 7) ||
    (weekdays[0] === 7 && weekdays[1] === 2)
  ) {
    let dts = startDates[startDates.length - 1];
    return weekdays.map(weekday => {
      dts = dts.plus({ days: weekday === 4 ? 3 : 2 });
      return [dts.toJSDate(), dts.plus({ minutes }).toJSDate()];
    });
  }

  // fallback, shift a week or 2 with the same pattern
  const weeks = Math.ceil(
    startDates[startDates.length - 1].diff(startDates[0], 'weeks').weeks
  );
  return startDates.map(ses => {
    const dts = ses.plus({ weeks });
    return [dts.toJSDate(), dts.plus({ minutes }).toJSDate()];
  });
}
