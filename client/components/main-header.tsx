import { Container, makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import React from 'react';
import { defaultBannerUrl } from '../../shared/constants';

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: blue[400],
    backgroundImage: `url(${defaultBannerUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  container: {
    color: theme.palette.common.white,
    textAlign: 'center',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.up('md')]: {
      minHeight: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
}));

export default function MainHeader(props: { children: React.ReactNode }) {
  const classes = useStyles({});
  return (
    <header className={classes.header}>
      <Container className={classes.container}>{props.children}</Container>
    </header>
  );
}
