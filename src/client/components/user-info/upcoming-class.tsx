import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Divider,
  Typography
} from '@material-ui/core';
import {
  CancelOutlined,
  EventNoteOutlined,
  ExpandMore,
  SwapCallsOutlined
} from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { Registration, Student } from '../../graphql/data-models';
import { getClassroomLink } from '../../lib/url-utils';
import EnrollmentItemSessions from '../my-classes/enrollment-item-sessions';
import NextMUIButton from '../next-mui-button';

function UpcomingClass(props: {
  student: Student;
  registration: Registration;
  onClickCancel: () => void;
  onClickReschedule: () => void;
}) {
  const { seats, class: klass } = props.registration;
  const now = new Date();
  const seat =
    seats.find(seat => new Date(seat.endDate) > now) || seats[seats.length - 1];

  let title = klass.course.name;
  let tag = '';

  if (seat.idx > 0) {
    title += ` (Session ${seat.idx + 1})`;
  }

  if (seat.added) {
    tag = 'Addon';
  } else if (klass.isCamp) {
    tag = `Camp`;
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: false }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <div style={{ flexBasis: '30%' }}>
          <Typography variant="subtitle1" color="textSecondary">
            {DateTime.fromISO(seat.startDate).toFormat('f')}
          </Typography>
        </div>
        <Typography variant="subtitle1" color="textPrimary">
          {title}
        </Typography>
        {tag && (
          <Chip
            size="small"
            label={tag}
            style={{ marginLeft: 16, alignSelf: 'center' }}
          />
        )}
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block' }}>
        <EnrollmentItemSessions seats={props.registration.seats} />
      </AccordionDetails>
      <Divider />
      <AccordionActions style={{ justifyContent: 'space-between' }}>
        {klass.hasClassroom && (
          <NextMUIButton
            variant="contained"
            color="primary"
            size="small"
            next={getClassroomLink(props.registration.class, props.student)}
            startIcon={<EventNoteOutlined />}
          >
            Classroom
          </NextMUIButton>
        )}

        <Button
          variant="contained"
          size="small"
          onClick={props.onClickReschedule}
          startIcon={<SwapCallsOutlined />}
        >
          Reschedule
        </Button>

        {klass.canCancel && (
          <Button
            variant="contained"
            size="small"
            onClick={props.onClickCancel}
            startIcon={<CancelOutlined />}
          >
            Cancel Registration
          </Button>
        )}
      </AccordionActions>
    </Accordion>
  );
}

export default React.memo(UpcomingClass);
