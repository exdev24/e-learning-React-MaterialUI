import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { CLASSES } from '../../shared/constants';

interface Props {
  label: string;
  onClick?: (evt: React.MouseEvent) => void;
}

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      padding: '8px 22px',
      fontSize: '0.9375rem'
    }
  }
}));

export default function ClassListingCTA(props: Props) {
  const classes = useStyles({});

  return (
    <div style={{ textAlign: 'center' }}>
      <Button
        color="primary"
        variant="contained"
        href={'#' + CLASSES}
        onClick={props.onClick}
        className={classes.button}
      >
        {props.label}
      </Button>
    </div>
  );
}
