import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Collapse,
  IconButton
} from '@material-ui/core';
import {
  CancelOutlined,
  EventNoteOutlined,
  ExpandLess,
  ExpandMore,
  SwapCallsOutlined
} from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { Registration, Student } from '../../graphql/data-models';
import { getClassroomLink } from '../../lib/url-utils';
import NextMUIButton from '../next-mui-button';
import EnrollmentItemSessions from './enrollment-item-sessions';

interface Props {
  student: Student;
  registration: Registration;
  onClickCancel: () => void;
  onClickReschedule: () => void;
}

export default function EnrollmentItem(props: Props) {
  const klass = props.registration.class;
  const start = DateTime.fromISO(klass.startDate);
  const end = DateTime.fromISO(klass.endDate);
  const hasEnded = end.toMillis() < Date.now();
  const [expanded, setExpanded] = React.useState(!hasEnded);

  let showClassRoom = false;
  let showCancel = false;

  if (klass.course.price === 0) {
    showCancel = !hasEnded;
  } else if (props.registration.seats[0].class.teacher) {
    showClassRoom = true;
  }

  return (
    <Card style={{ marginTop: 32 }}>
      <CardHeader
        title={klass.course.name}
        subheader={
          props.registration.seats.length > 1
            ? start.toFormat('D - ') + end.toFormat('D')
            : start.toFormat('DDDD')
        }
      />
      <CardActions>
        {showClassRoom && (
          <NextMUIButton
            variant="contained"
            size="small"
            next={getClassroomLink(klass, props.student)}
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
        {showCancel && (
          <Button
            onClick={props.onClickCancel}
            variant="contained"
            size="small"
            startIcon={<CancelOutlined />}
          >
            Cancel Registration
          </Button>
        )}

        <IconButton
          style={{ marginLeft: 'auto' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <EnrollmentItemSessions seats={props.registration.seats} />
      </Collapse>
    </Card>
  );
}
