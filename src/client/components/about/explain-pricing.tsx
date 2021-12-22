import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { coursePerUnitPrice, regularPerUnitPrice } from 'cl-common';
import React from 'react';
import { CLASSES, contactEmail } from '../../../shared/constants';
import MainSection from '../main-section';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    alignItems: 'center',
    '&>main': {
      ...theme.typography.subtitle1,
      paddingLeft: 20,
      textAlign: 'right',
      flex: 1
    }
  },

  bubble: {
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
    width: 120,
    height: 120,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    '&>strong': {
      ...theme.typography.h4,
      display: 'block',
      fontWeight: theme.typography.fontWeightBold
    }
  },

  footer: {
    textAlign: 'center',
    marginTop: theme.spacing(6),
    ...theme.typography.subtitle1
  }
}));

export default function ExplainPricing() {
  const classes = useStyles({});

  return (
    <MainSection
      header={
        <>
          <Typography variant="h3" gutterBottom>
            Price per Unit
          </Typography>
          <Typography variant="h6">
            Each Unit Consists of Four 1-Hour Sessions
          </Typography>
        </>
      }
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Learning by Unit" />
            <CardContent className={classes.content}>
              <div className={classes.bubble}>
                <strong>${regularPerUnitPrice}</strong>
                Per Unit
              </div>
              <main>
                {
                  'A great way to try out a subject, gaining foundational knowledge 1 unit at a time.'
                }
              </main>
            </CardContent>
            <CardActions>
              <Button
                href={'#' + CLASSES}
                fullWidth
                color="primary"
                variant="contained"
              >
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Learning by Course" />
            <CardContent className={classes.content}>
              <div className={classes.bubble}>
                <strong>${coursePerUnitPrice}</strong>
                Per Unit
              </div>
              <main>
                {
                  'Reach for mastery by completing a course. Each course includes 2 to 3 units.'
                }
              </main>
            </CardContent>
            <CardActions>
              <Button
                href={'#' + CLASSES}
                fullWidth
                color="primary"
                variant="contained"
              >
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Bring a Group" />
            <CardContent className={classes.content}>
              <div className={classes.bubble}>
                <Typography variant="h5" align="center">
                  Group Rates
                </Typography>
              </div>
              <main>Learning together is better. Contact us for group rates.</main>
            </CardContent>
            <CardActions>
              <Button
                href={'mailto:' + contactEmail}
                fullWidth
                color="secondary"
                variant="contained"
              >
                {contactEmail}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <div className={classes.footer}>
        Experienced teachers provide guided instruction.
        <br />
        Class size is no more than 5:1 student-to-teacher ratio.
      </div>
    </MainSection>
  );
}
