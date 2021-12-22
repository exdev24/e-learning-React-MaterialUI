import { makeStyles } from '@material-ui/core';
import React from 'react';

interface Props {
  style?: React.CSSProperties;
  ratio?: number;
  children?: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.grey.A100,
    '&>:nth-child(2)': {
      position: 'absolute',
      display: 'block',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
  }
}));

export default function MediaRect(props: Props) {
  const classes = useStyles({});
  const ratio = props.ratio || 9 / 16;

  return (
    <div className={classes.wrapper} style={props.style}>
      <div style={{ paddingTop: ratio * 100 + '%' }} />
      {props.children}
    </div>
  );
}
