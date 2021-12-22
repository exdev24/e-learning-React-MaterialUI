import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

interface Props {
  name: string;
  children: React.ReactNode;
  content: React.ReactNode;
  color: {
    500: string;
    700: string;
  };
}

const useStyles = makeStyles(theme => ({
  card: {
    borderLeftStyle: 'solid',
    borderLeftWidth: theme.spacing(3),
    padding: theme.spacing(2)
  },

  name: {
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: theme.spacing(2)
  },

  schedules: {
    margin: theme.spacing(4, 0),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3)
    }
  }
}));

export default function CourseCard(props: Props) {
  const classes = useStyles({});

  return (
    <>
      <Paper
        className={classes.card}
        style={{
          borderLeftColor: props.color[500]
        }}
      >
        <Typography
          variant="h6"
          className={classes.name}
          style={{
            color: props.color[700]
          }}
        >
          {props.name}
        </Typography>
        {props.content}
      </Paper>
      <div className={classes.schedules}>{props.children}</div>
    </>
  );
}
