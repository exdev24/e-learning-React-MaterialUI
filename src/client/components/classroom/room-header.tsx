import {
  Card,
  CardContent,
  Collapse,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { Classroom } from '../../../client/graphql/data-models';
import { defaultCoverUrl } from '../../../shared/constants';

const useStyles = makeStyles(theme => ({
  hero: {
    overflow: 'hidden',
    marginBottom: theme.spacing(4),
    '&>header': {
      height: '14rem',
      backgroundSize: 'cover',
      backgroundImage: `url(${defaultCoverUrl})`,
      position: 'relative',
      color: theme.palette.common.white,
      padding: theme.spacing(3)
    }
  },
  arrow: {
    color: 'inherit',
    position: 'absolute',
    bottom: 0,
    right: 0
  }
}));

function RoomHeader(props: { classroom: Classroom }) {
  const classes = useStyles({});
  const [expanded, setExpanded] = React.useState(false);

  const dstart = DateTime.fromISO(props.classroom.startDate);
  const dend = DateTime.fromISO(props.classroom.endDate);
  const now = DateTime.local();

  let subheader = '';
  if (dstart.plus({ hour: 1 }) < now) {
    subheader = 'Staring at ' + dstart.toFormat('DDDD');
  } else if (dend.minus({ hour: 1 }) > now) {
    subheader = 'Ended at ' + dend.toFormat('DDDD');
  } else {
    subheader = dstart.toFormat('t, D - ') + dend.toFormat('D');
  }

  return (
    <Card className={classes.hero}>
      <header>
        <Typography variant="h4">{props.classroom.course.name}</Typography>
        <Typography variant="h6">{subheader}</Typography>
        <IconButton className={classes.arrow} onClick={() => setExpanded(!expanded)}>
          {expanded ? <ArrowUpward /> : <ArrowDownward />}
        </IconButton>
      </header>
      <Collapse in={expanded} unmountOnExit>
        <CardContent>{props.classroom.course.description}</CardContent>
      </Collapse>
    </Card>
  );
}

export default React.memo(RoomHeader);
