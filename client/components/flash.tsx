import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const flashColor = '#E53B3B';

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: flashColor,
    color: theme.palette.common.white
  },
  arrow: {
    top: '100%',
    left: '50%',
    border: 'solid transparent',
    height: 0,
    width: 0,
    position: 'absolute',
    pointerEvents: 'none',
    borderTopColor: flashColor,
    borderWidth: 20,
    marginLeft: -20
  },
  title: {
    fontSize: theme.typography.h4.fontSize,
    fontFamily: "'Fredoka One', cursive",
    letterSpacing: '0.33rem',
    margin: 0
  },
  subtitle: {
    ...theme.typography.subtitle2,
    letterSpacing: theme.typography.overline.letterSpacing,
    fontWeight: theme.typography.fontWeightRegular,
    margin: 0
  }
}));

export default function Flash(props: {
  title: string;
  subtitle?: string;
  fontFamily?: string;
}) {
  const classes = useStyles({});

  return (
    <div className={classes.wrapper}>
      <h4
        className={classes.title}
        style={{
          fontFamily: props.fontFamily || 'inherit'
        }}
      >
        {props.title}
      </h4>
      {props.subtitle && <h6 className={classes.subtitle}>{props.subtitle}</h6>}
      <div className={classes.arrow} />
    </div>
  );
}
