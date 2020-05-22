import { makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React from 'react';
import { formatCents } from '../../shared/pricing';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.subtitle1,
    '&>del': {
      color: theme.palette.grey[600],
      fontWeight: theme.typography.fontWeightMedium
    }
  },
  current: {
    color: green[800],
    fontWeight: theme.typography.fontWeightBold,
    padding: theme.spacing(0, 1)
  },
  badge: {
    ...theme.typography.subtitle2,
    padding: '2px 5px',
    borderRadius: 2,
    backgroundColor: green[100],
    color: green[800]
  }
}));

export default function DiscountPricing(props: {
  children: React.ReactNode;
  priceInCents: number;
  badge: string;
}) {
  const classes = useStyles({});

  return (
    <div className={classes.wrapper}>
      {props.children}
      <span className={classes.current}>{formatCents(props.priceInCents)}</span>
      <span className={classes.badge}>{props.badge}</span>
    </div>
  );
}
