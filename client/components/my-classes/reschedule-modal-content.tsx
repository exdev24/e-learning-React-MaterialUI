import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogContentText,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import { DateTime } from 'luxon';
import React from 'react';
import { contactEmail } from '../../../shared/constants';
import { CourseIdVars, MutationArgs, QueryArgs } from '../../../types';
import {
  AddonCandidatesQuery,
  ClassListResult,
  RescheduleCandidatesQuery,
  SessionsListResult
} from '../../graphql/class-queries';
import { Registration } from '../../graphql/data-models';
import { RescheduleEnrollmentMutation } from '../../graphql/enrollment-queries';
import { StudentRegistrationsQuery } from '../../graphql/user-queries';
import CLButton from '../button';

interface RescheduleClassProps {
  studentId: string;
  classId: string;
  registration: Registration;
  onClose: () => void;
  onSelected: (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

interface RescheduleSessionProps extends RescheduleClassProps {
  idx: number;
}

const errorWarning = (
  <DialogContent>
    <DialogContentText color="error">Unexpect error, try reload</DialogContentText>
  </DialogContent>
);

const emptyResultText = (
  <DialogContentText>
    {`We don't have any class scheduled at the moment, please contact us at ${contactEmail} with your available time to reschedule.`}
  </DialogContentText>
);

const additionalScheduleText = (
  <DialogContentText>
    {`If you cannot find a class fit your schedule, please contact us at ${contactEmail} with your available time to reschedule.`}
  </DialogContentText>
);

export function RescheduleClass(props: RescheduleClassProps) {
  const result = useQuery<ClassListResult, CourseIdVars>(RescheduleCandidatesQuery, {
    fetchPolicy: 'network-only',
    variables: { courseId: props.registration.class.courseId }
  });

  const [handleSubmit, submitStatus] = useMutation<
    any,
    MutationArgs.RescheduleEnrollment
  >(RescheduleEnrollmentMutation, {
    onCompleted: props.onClose,
    refetchQueries: [
      {
        query: StudentRegistrationsQuery,
        variables: { id: props.studentId }
      }
    ],
    variables: {
      id: props.registration.id,
      classId: props.classId
    }
  });

  if (result.error) return errorWarning;
  if (!result.data || !result.data.classes) return <LinearProgress />;

  if (result.data.classes.length === 0) {
    return (
      <>
        <DialogContent>{emptyResultText}</DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <DialogContent>
        {additionalScheduleText}
        <List disablePadding>
          {result.data.classes.map(cls => {
            const dts = DateTime.fromISO(cls.startDate);
            const dte = DateTime.fromISO(cls.endDate);

            let caption = '';
            if (cls.id === props.registration.class.id) {
              caption = 'Your current class';
            } else if (cls.isCamp) {
              caption = 'Online Camp';
            }

            return (
              <ListItem key={cls.id} divider disabled={cls.isFull}>
                <ListItemText
                  primary={
                    cls.schedules.length === 1
                      ? dts.toFormat('cccc t, D')
                      : dts.toFormat('cccc t, L/dd') + dte.toFormat(' - L/dd')
                  }
                  secondary={caption}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    value={cls.id}
                    disabled={cls.isFull}
                    checked={cls.id === props.classId}
                    onChange={props.onSelected}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
        <CLButton
          color="primary"
          variant="contained"
          disabled={props.classId === props.registration.class.id}
          loading={submitStatus.loading}
          onClick={() => handleSubmit()}
        >
          Reschedule
        </CLButton>
      </DialogActions>
    </>
  );
}

export function RescheduleSession(props: RescheduleSessionProps) {
  const result = useQuery<SessionsListResult, QueryArgs.AddonCandidates>(
    AddonCandidatesQuery,
    {
      fetchPolicy: 'network-only',
      variables: { courseId: props.registration.class.courseId, idx: props.idx }
    }
  );

  const [handleSubmit, submitStatus] = useMutation<
    any,
    MutationArgs.RescheduleEnrollment
  >(RescheduleEnrollmentMutation, {
    onCompleted: props.onClose,
    refetchQueries: [
      {
        query: StudentRegistrationsQuery,
        variables: { id: props.studentId }
      }
    ],
    variables: {
      id: props.registration.id,
      classId: props.classId,
      idx: props.idx
    }
  });

  if (result.error) return errorWarning;
  if (!result.data || !result.data.sessions) return <LinearProgress />;

  if (result.data.sessions.length === 0) {
    return (
      <>
        <DialogContent>{emptyResultText}</DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <DialogContent>
        {additionalScheduleText}
        <List disablePadding>
          {result.data.sessions.map(ses => (
            <ListItem key={ses.id} divider>
              <ListItemText
                primary={DateTime.fromISO(ses.startDate).toFormat('cccc, t, D')}
                secondary={
                  ses.classId === props.registration.class.id
                    ? 'Your current class'
                    : ''
                }
              />
              <ListItemSecondaryAction>
                <Checkbox
                  value={ses.classId}
                  checked={ses.classId === props.classId}
                  onChange={props.onSelected}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
        <CLButton
          color="primary"
          variant="contained"
          disabled={props.classId === props.registration.class.id}
          loading={submitStatus.loading}
          onClick={() => handleSubmit()}
        >
          Reschedule
        </CLButton>
      </DialogActions>
    </>
  );
}
