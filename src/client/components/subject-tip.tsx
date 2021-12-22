import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  workProcess: {
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
      flexBasis: '100%'
    }
  },
  tipContainer: {
    padding: theme.spacing(16),
    margin: theme.spacing(8, 0),
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    backgroundSize: 'cover',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(4)
    }
  },
  firstTipBackground: {
    backgroundImage: 'url("/images/grey-banner-with-cart.png")',
    [theme.breakpoints.down('xs')]: {
      backgroundImage: 'url(/images/grey-banner.png)'
    }
  },
  otherTipBackground: {
    backgroundImage: 'url("/images/grey-banner.png")'
  },
  backdiv: {
    backgroundImage: 'url("/images/bottom-border.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    backgroundSize: 'contain'
  }
}));

interface IndividualTip {
  fWord: string;
  sWord: string;
}

interface Props {
  firstOrder?: boolean;
  header: string;
  subheader: string;
  tips: IndividualTip[];
}

export default function SubjectTip(props: Props) {
  const classes = useStyles({});
  const tipBackground = props.firstOrder
    ? classes.firstTipBackground
    : classes.otherTipBackground;
  return (
    <Box textAlign="center" className={`${classes.tipContainer} ${tipBackground}`}>
      <Typography variant="h4" style={{ fontWeight: 'bold' }}>
        {`-${props.header}-`}
      </Typography>
      <Typography variant="h4" style={{ fontWeight: 'bold' }}>
        {props.subheader}
      </Typography>

      <Grid container spacing={8} style={{ marginTop: '1em' }}>
        {props.tips.map((tip, index) => (
          <Grid item xs={4} sm={4} key={index} className={classes.workProcess}>
            <div className={classes.backdiv}>
              <Typography variant="h6">{tip.fWord}</Typography>
              <Typography variant="h6">{tip.sWord}</Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
