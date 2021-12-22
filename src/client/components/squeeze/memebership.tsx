import { makeStyles, Typography } from '@material-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { routeIds } from '../../../shared/constants';
import NextMUIButton from '../next-mui-button';

const useStyles = makeStyles(theme => ({
  bullets: {
    textAlign: 'left',
    ...theme.typography.subtitle1,
    fontWeight: theme.typography.fontWeightBold
  },
  heroWrapper: {
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(4, 0)
  },
  heroContent: {
    display: 'flex',
    padding: theme.spacing(0, 2),
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center'
    },
    '&>div': {
      margin: theme.spacing(2)
    }
  },
  bubble: {
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    width: 128,
    height: 128,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  }
}));

function Memebership() {
  const classes = useStyles({});

  return (
    <section className={classes.heroWrapper}>
      <Typography variant="h3" align="center">
        Become a Member
      </Typography>

      <div className={classes.heroContent}>
        <NextLink href={routeIds.signup}>
          <div className={classes.bubble}>
            <Typography variant="h4">
              <strong>FREE</strong>
            </Typography>
            Membership
          </div>
        </NextLink>
        <div>
          <Typography variant="h6" align="left">
            Sign Up to Access
          </Typography>
          <ol className={classes.bullets}>
            <li>Free introductory sessions</li>
            <li>Invitation to promotions and events</li>
            <li>Refer-a-friend bonus</li>
          </ol>
          <div style={{ textAlign: 'right' }}>
            <NextMUIButton
              color="primary"
              variant="contained"
              size="large"
              next={{
                href: routeIds.signup
              }}
            >
              Sign Up
            </NextMUIButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Memebership);
