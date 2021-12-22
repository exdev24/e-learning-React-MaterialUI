import { Button, ButtonProps, makeStyles } from '@material-ui/core';
import NextLink, { LinkProps } from 'next/link';
import React from 'react';
import { CLASSES } from '../../../shared/constants';

interface Props extends ButtonProps {
  next?: LinkProps;
  classList?: boolean;
  children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
  constainter: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(3)
    }
  },

  button: {
    textTransform: 'capitalize',
    [theme.breakpoints.up('sm')]: {
      padding: '8px 22px',
      fontSize: theme.typography.pxToRem(15)
    }
  }
}));

export default function ResponsiveCTA({
  next,
  classList,
  children,
  ...btnProps
}: Props) {
  const classes = useStyles();

  if (!btnProps.color) {
    btnProps.color = 'primary';
  }

  if (!btnProps.variant) {
    btnProps.variant = 'contained';
  }

  if (next) {
    return (
      <div className={classes.constainter}>
        <NextLink passHref {...next}>
          <Button {...btnProps} className={classes.button}>
            {children}
          </Button>
        </NextLink>
      </div>
    );
  }

  if (!btnProps.href && classList) {
    btnProps.href = '#' + CLASSES;
  }

  return (
    <div className={classes.constainter}>
      <Button {...btnProps} className={classes.button}>
        {children}
      </Button>
    </div>
  );
}
