import { Grid, Hidden, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'white',
    position: 'relative',
    top: '-100px',
    paddingTop: '80px',
    backgroundImage: 'url(/images/concept.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'left',
    backgroundPositionY: '90px',
    backgroundSize: '300px',
    [theme.breakpoints.down('sm')]: {
      backgroundImage: 'none'
    }
  },
  concept: {
    backgroundImage: 'url("/images/bottom-border.png")',
    padding: '10% 0',
    marginBottom: theme.spacing(7),
    textAlign: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    backgroundSize: 'contain'
  }
}));
export default function SubjectConcepts(props: { children: React.ReactNode }) {
  const classes = useStyles();

  return (
    <Grid container spacing={6} className={classes.container}>
      <Hidden smDown>
        <Grid item xs={12} md="auto" style={{ paddingTop: '380px' }}>
          <div className={classes.concept}>
            <Typography variant="h5">computational</Typography>
            <Typography variant="h5">concepts</Typography>
          </div>
          <div className={classes.concept}>
            <Typography variant="h5">creative</Typography>
            <Typography variant="h5">thinking</Typography>
          </div>
          <div className={classes.concept}>
            <Typography variant="h5">real-world</Typography>
            <Typography variant="h5">connection</Typography>
          </div>
        </Grid>
      </Hidden>
      <Grid item xs={12} md>
        {props.children}
      </Grid>
    </Grid>
  );
}
