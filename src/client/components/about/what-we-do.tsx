import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import MainSection from '../main-section';
import { keyBullets } from './talking-points';

const useStyles = makeStyles(theme => ({
  bullet: {
    marginBottom: theme.spacing(4),
    display: 'flex'
  },

  icon: {
    flex: '0 auto',
    textAlign: 'center',
    minWidth: 144,
    padding: theme.spacing(1),
    '&>img': {
      height: 72,
      width: 'auto'
    }
  },

  content: {
    flex: 1
  }
}));

export default function WhatWeDo(props: { stripe?: boolean }) {
  const classes = useStyles({});

  return (
    <MainSection
      stripe={props.stripe}
      header={
        <Typography variant="h4" align="center" style={{ marginBottom: 80 }}>
          We have built the Best Live Online Tech Classes in the last 3 years
        </Typography>
      }
    >
      <Grid container spacing={2}>
        {keyBullets.map((bullet, idx) => (
          <Grid item md={6} key={idx} className={classes.bullet}>
            <div className={classes.icon}>
              <img src={bullet.icon} alt={bullet.title} />
            </div>
            <div className={classes.content}>
              <Typography variant="h6">{bullet.title}</Typography>
              <Typography variant="subtitle2">{bullet.description}</Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </MainSection>
  );
}
