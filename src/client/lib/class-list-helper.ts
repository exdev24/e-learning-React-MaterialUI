import { defaultTimezone, tzOpts } from 'cl-common';
import { DateTime } from 'luxon';
import { ClassLite } from '../graphql/data-models';

export function getListableClassGroups(klasses: ClassLite[]) {
  let firstSaturday = -1;
  const groups: ClassLite[][] = [];
  const openClassGroups: boolean[] = [];
  const startOfToday = DateTime.local().setZone(defaultTimezone).startOf('day');

  klasses.forEach(c => {
    const ct = DateTime.fromISO(c.startDate, tzOpts).startOf('day');
    const bucket = ct.diff(startOfToday, 'days').days;

    if (ct.weekday === 6 && firstSaturday <= 0) {
      firstSaturday = bucket;
    }

    if (!c.isFull) {
      openClassGroups[bucket] = true;
    }

    if (!groups[bucket]) {
      groups[bucket] = [c];
    } else {
      groups[bucket].push(c);
    }
  });

  const result: ClassLite[][] = [];

  for (let idx = 0, daysWithClass = 0; idx < groups.length; idx++) {
    if (groups[idx]) {
      result.push(groups[idx]);
    }

    if (openClassGroups[idx]) {
      daysWithClass++;
    }

    if (daysWithClass >= 3) {
      if (idx < firstSaturday) {
        result.push(groups[firstSaturday]);
      }

      break;
    }
  }

  return result;
}
