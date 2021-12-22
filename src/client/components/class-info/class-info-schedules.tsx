import { Typography } from '@material-ui/core';
import { DateTime } from 'luxon';
import React from 'react';
import { ClassBase } from '../../graphql/data-models';

interface Props {
  schedules: ClassBase['schedules'];
}

function ClassInfoSchedules(props: Props) {
  if (props.schedules.length === 1) {
    return (
      <Typography component="span" display="block" variant="subtitle2">
        {DateTime.fromISO(props.schedules[0][0]).toFormat('ccc, D, t - ') +
          DateTime.fromISO(props.schedules[0][1]).toFormat('t')}
      </Typography>
    );
  }

  return (
    <>
      {props.schedules.map((session, idx) => (
        <Typography key={idx} component="span" display="block" variant="subtitle2">
          {DateTime.fromISO(session[0]).toFormat('ccc, D, t - ') +
            DateTime.fromISO(session[1]).toFormat('t')}
        </Typography>
      ))}
    </>
  );
}

export default React.memo(ClassInfoSchedules);
