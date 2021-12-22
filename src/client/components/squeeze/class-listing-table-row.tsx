import { Button, TableCell, TableRow, Typography } from '@material-ui/core';
import { DateTime, Interval } from 'luxon';
import React from 'react';
import { useTranslation } from '../../../shared/i18n';
import { ClassLite } from '../../graphql/data-models';

interface Props {
  klass: ClassLite;
  selected: boolean;
  idx: number;
  children: React.ReactElement;
}

export default function ClassScheduleTableRow(props: Props) {
  const { t } = useTranslation();
  const start = DateTime.fromISO(props.klass.startDate);

  return (
    <TableRow selected={props.selected}>
      <TableCell>
        {props.idx === 0 && (
          <>
            <Typography
              color="secondary"
              variant="h6"
              style={{ fontWeight: 'bold' }}
            >
              {start.weekdayShort}
            </Typography>
            <Typography color="secondary" variant="caption">
              {start.toLocaleString(DateTime.DATE_MED)}
            </Typography>
          </>
        )}
      </TableCell>
      <TableCell>
        <div>
          {Interval.fromISO(
            props.klass.schedules[0][0] + '/' + props.klass.schedules[0][1]
          ).toFormat('t')}
        </div>
        <Typography variant="caption" color="textSecondary">
          {start.offsetNameLong}
        </Typography>
      </TableCell>
      <TableCell align="right">
        {props.klass.isFull ? (
          <Button variant="contained" disabled size="small">
            {t('cta.enroll_full')}
          </Button>
        ) : (
          props.children
        )}
      </TableCell>
    </TableRow>
  );
}
