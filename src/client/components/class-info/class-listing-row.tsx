import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Event, Timer } from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from '../../../shared/i18n';
import { ClassLite } from '../../graphql/data-models';
import EnrollButton from '../enroll-button';

const weekDays = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];

const useStyles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(2),
    borderBottom: `1px dotted ${theme.palette.divider}`,
    '&:last-of-type': {
      marginBottom: 0
    }
  },

  icon: {
    color: 'inherit',
    width: 16,
    height: 16,
    verticalAlign: 'text-bottom',
    marginRight: theme.spacing(1)
  },

  weekView: {
    margin: theme.spacing(2, 0),
    display: 'flex',
    '&>div': {
      textAlign: 'center',
      fontSize: 10,
      lineHeight: '20px',
      height: 20,
      width: 20,
      marginRight: theme.spacing(1),
      borderRadius: 2
    }
  },

  activeDay: {
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },

  inactiveDay: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default
  },

  badge: {
    ...theme.typography.subtitle2,
    padding: '2px 5px',
    borderRadius: 2,
    backgroundColor: green[100],
    color: green[800],
    marginLeft: 8
  }
}));

export default function ClassListingRow(props: {
  klass: ClassLite;
  price: number;
  wholePackage?: boolean;
  unitCount?: number;
}) {
  const classes = useStyles({});
  const { t } = useTranslation();

  // https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-get-weekday
  // Monday starts at 1
  const classDays: boolean[] = [];
  const classDates: string[] = [];
  const dts = DateTime.fromISO(props.klass.startDate);

  props.klass.schedules.forEach(schedule => {
    const dt = DateTime.fromISO(schedule[0]);
    classDays[dt.weekday - 1] = true;
    classDates.push(dt.toFormat('L/dd'));
  });

  let sessionsCount = props.klass.schedules.length;
  if (props.unitCount > 0) {
    sessionsCount = sessionsCount * props.unitCount;
  }

  let titleFormat = 'DDDD';
  if (sessionsCount > 1) {
    if (props.klass.isWeekly) {
      titleFormat = `'Every' cccc 'for ${sessionsCount} weeks, starting' DDD`;
    } else if (props.klass.isCamp) {
      titleFormat = `'Online Camp starting' DDDD`;
    } else {
      titleFormat = `'${sessionsCount} sessions, starting' DDDD`;
    }
  }

  if (props.klass.isFull) {
    return (
      <Grid container spacing={3} className={classes.row}>
        <Grid item xs>
          <Typography variant="subtitle1" color="textSecondary">
            {dts.toFormat(titleFormat)}
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" disabled size="small">
            {t('cta.enroll_full')}
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <div className={classes.row} style={{ paddingBottom: 16 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs>
          {props.klass.isCamp ? (
            <Typography variant="subtitle1" gutterBottom>
              {dts.toFormat(titleFormat)}
              <span className={classes.badge}>50% Off</span>
            </Typography>
          ) : (
            <Typography variant="subtitle1" gutterBottom>
              {dts.toFormat(titleFormat)}
            </Typography>
          )}

          <div className={classes.weekView}>
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={classDays[idx] ? classes.activeDay : classes.inactiveDay}
              >
                {day}
              </div>
            ))}
          </div>
        </Grid>
        <Grid item>
          <EnrollButton
            klass={props.klass}
            wholePackage={props.wholePackage}
            price={props.price}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs>
          <Typography variant="caption">
            <Event className={classes.icon} />
            {classDates.join(', ')}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="caption">
            <Timer className={classes.icon} />
            {dts.toFormat('t, ZZZZZ')}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
