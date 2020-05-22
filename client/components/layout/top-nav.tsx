import { AppBar, Container } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { siteLogoUrl } from 'common';
import React from 'react';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary
    },

    wrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    logo: {
      display: 'block',
      padding: theme.spacing(2, 0),
      '&>img': {
        display: 'block',
        height: 36
      }
    },

    nav: {
      display: 'flex',
      alignItems: 'center'
    }
  })
);

export default function TopNav(props: { children?: React.ReactNode }) {
  const classes = useStyles(props);

  return (
    <AppBar position="static" className={classes.root}>
      <Container className={classes.wrapper}>
        <a href="/" className={classes.logo}>
          <img src={siteLogoUrl} />
        </a>
        <nav className={classes.nav}>{props.children}</nav>
      </Container>
    </AppBar>
  );
}
