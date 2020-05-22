import {
  Avatar,
  Chip,
  Link,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import {
  CameraOutlined,
  SubdirectoryArrowRight,
  TimerOutlined
} from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { Seat } from '../../graphql/data-models';

const styles: Record<string, React.CSSProperties> = {
  avatar: {
    background: 'inherit',
    width: '2rem',
    height: '2rem',
    marginRight: '1rem'
  },
  icon: {
    width: '100%',
    height: '100%'
  }
};

export default function EnrollmentItemSessions(props: { seats: Seat[] }) {
  if (props.seats.length === 1) {
    const klass = props.seats[0].class;

    return (
      <List dense>
        <ListItem>
          <Avatar style={styles.avatar}>
            <TimerOutlined color="action" style={styles.icon} />
          </Avatar>
          <ListItemText
            primary="Class Time"
            secondary={
              DateTime.fromISO(klass.startDate).toFormat('ff') +
              DateTime.fromISO(klass.endDate).toFormat(' - t, ZZZZZ')
            }
          />
        </ListItem>
        <ListItem>
          <Avatar style={styles.avatar}>
            <CameraOutlined color="action" style={styles.icon} />
          </Avatar>
          <ListItemText
            primary="Zoom"
            secondary={
              klass.dialInLink ? (
                <Link color="secondary" href={klass.dialInLink}>
                  {klass.dialInLink}
                </Link>
              ) : (
                'N/A'
              )
            }
          />
        </ListItem>
        {klass.teacher && (
          <ListItem>
            <Avatar style={styles.avatar} src={klass.teacher.avatar} />
            <ListItemText primary="Teacher" secondary={klass.teacher.fullName} />
          </ListItem>
        )}
      </List>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell variant="head">Session</TableCell>
          <TableCell variant="head">Class Time</TableCell>
          <TableCell variant="head">Zoom</TableCell>
          <TableCell variant="head">Teacher</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.seats.map(seat => (
          <TableRow key={seat.id}>
            <TableCell>
              <Typography variant="subtitle2">
                <SubdirectoryArrowRight
                  fontSize="small"
                  color="inherit"
                  style={{ verticalAlign: 'bottom' }}
                />
                Session {seat.idx + 1}
              </Typography>
              {seat.added ? (
                <Typography color="error" variant="caption">
                  This session was rescheduled
                </Typography>
              ) : (
                ''
              )}
            </TableCell>
            <TableCell>{DateTime.fromISO(seat.startDate).toFormat('f')}</TableCell>
            <TableCell>
              {seat.class.dialInLink && (
                <Link color="secondary" href={seat.class.dialInLink}>
                  {seat.class.dialInLink}
                </Link>
              )}
            </TableCell>
            <TableCell>
              {seat.class.teacher ? (
                <Chip
                  avatar={<Avatar src={seat.class.teacher.avatar} />}
                  label={seat.class.teacher.fullName}
                />
              ) : (
                'N/A'
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
