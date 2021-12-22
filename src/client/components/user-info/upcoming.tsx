import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { Registration, Student } from '../../graphql/data-models';
import { UserSummaryQuery } from '../../graphql/user-queries';
import { getMyClassesLink } from '../../lib/url-utils';
import CancelModal from '../my-classes/cancel-modal';
import RescheduleModal from '../my-classes/reschedule-modal';
import NextMUIButton from '../next-mui-button';
import UpcomingClass from './upcoming-class';

export default function Upcoming(props: {
  student: Student;
  registrations: Registration[];
}) {
  const [toReschedule, setReschedule] = React.useState<Registration>(null);
  const [toCancel, setCancel] = React.useState<Registration>(null);

  if (props.registrations.length === 0) {
    return null;
  }

  return (
    <div>
      {toCancel && (
        <CancelModal
          registration={toCancel}
          refetchQuery={{ query: UserSummaryQuery }}
          onClose={() => setCancel(null)}
        />
      )}
      {toReschedule && (
        <RescheduleModal
          registration={toReschedule}
          studentId={props.student.id}
          onClose={() => setReschedule(null)}
        />
      )}
      <Grid container justify="space-between" style={{ marginBottom: 16 }}>
        <Grid item xs>
          <Typography variant="h6">Upcoming Classes</Typography>
        </Grid>
        <Grid item xs="auto">
          <NextMUIButton
            color="secondary"
            variant="contained"
            size="small"
            next={getMyClassesLink(props.student)}
          >
            View All
          </NextMUIButton>
        </Grid>
      </Grid>

      {props.registrations.map(registration => (
        <UpcomingClass
          key={registration.id}
          student={props.student}
          registration={registration}
          onClickCancel={() => setCancel(registration)}
          onClickReschedule={() => setReschedule(registration)}
        />
      ))}
    </div>
  );
}
