import { Container, ContainerProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  section: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    position: 'relative',
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.background.default
    }
  },
  header: {
    margin: '0 auto 56px',
    maxWidth: 720,
    textAlign: 'center'
  }
}));

interface Props extends ContainerProps {
  header?: React.ReactNode;
}

export default function MainSection({ children, header, ...props }: Props) {
  const classes = useStyles({});
  return (
    <section className={classes.section}>
      <Container {...props}>
        {header && <div className={classes.header}>{header}</div>}
        {children}
      </Container>
    </section>
  );
}
