import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: theme.typography.fontWeightMedium,
    color: 'inherit',
    whiteSpace: 'pre-line',
    [theme.breakpoints.down('sm')]: {
      ...theme.typography.h3
    }
  }
}));

export default function ResponsiveTitle(props: { text: string }) {
  const classes = useStyles();
  return (
    <Typography variant="h2" className={classes.title}>
      {props.text}
    </Typography>
  );
}
