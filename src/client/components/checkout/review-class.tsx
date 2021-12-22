import { Box, Grid, List } from '@material-ui/core';
import {
  EventNoteRounded,
  FaceRounded,
  PaymentRounded,
  SubjectRounded
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React from 'react';
import { ClassWithCourse } from '../../graphql/data-models';
import ClassInfoSchedules from '../class-info/class-info-schedules';
import InfoListItem from '../class-info/info-list-item';
import HorizontalDivider from '../horizontal-divider';

interface Props {
  klass: ClassWithCourse;
  children: React.ReactNode;
}

export default function ReviewClass(props: Props) {
  const { course, schedules } = props.klass;
  const ct = DateTime.fromISO(props.klass.startDate);

  return (
    <Box padding={4} boxShadow={2}>
      <Grid container spacing={3}>
        <Grid item sm={4}>
          <img src={course.thumbnail} alt={course.name} />
        </Grid>
        <Grid item sm={8}>
          <List disablePadding dense>
            <InfoListItem
              Icon={FaceRounded}
              primary={`Grades ${course.grades.join('-')}`}
            />

            {course.price > 0 && (
              <InfoListItem
                Icon={PaymentRounded}
                primary={`$${course.price} (USD)`}
                secondary={`${schedules.length} Sessions`}
              />
            )}

            <InfoListItem
              Icon={EventNoteRounded}
              primary={<ClassInfoSchedules schedules={schedules} />}
              secondary={ct.offsetNameLong}
            />

            {course.info && (
              <InfoListItem Icon={SubjectRounded} primary={course.info} />
            )}
          </List>
          {ct.hour < 7 && (
            <Alert color="warning">
              Class starts very early in your timezone. ({ct.toFormat('t')})
            </Alert>
          )}
          {ct.hour > 20 && (
            <Alert color="warning">
              Class starts very late in your timezone. ({ct.toFormat('t')})
            </Alert>
          )}
        </Grid>
      </Grid>
      <HorizontalDivider />
      {props.children}
    </Box>
  );
}
