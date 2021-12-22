import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

interface Props {
  image: string;
  index: number;
  contents: string[];
}

const useStyles = makeStyles(theme => ({
  section: {
    borderBottomColor: 'rgb(208, 231, 242)',
    borderBottomStyle: 'dotted',
    borderBottomWidth: '8px',
    padding: theme.spacing(2, 0),
    textAlign: 'center',
    height: '160px',
    fontSize: theme.spacing(2.5),
    overflow: 'hidden',
    '&:last-child': {
      borderBottom: 'none',
      height: '80px'
    }
  },
  imageCard: {
    backgroundColor: 'rgb(112, 214, 255)',
    borderRadius: '40px',
    height: '250px',
    paddingTop: '5px',
    textAlign: 'center'
  },
  cardHeader: {
    textTransform: 'uppercase',
    fontSize: '28px',
    '&::first-letter': {
      fontSize: '32px'
    }
  },
  cardSubHeader: {
    textTransform: 'uppercase',
    fontSize: '20px',
    '&::first-letter': {
      fontSize: '24px'
    }
  }
}));

export default function CourseConcept(props: Props) {
  const classes = useStyles();
  const indexReverse: number = 3 - props.index;
  const headerStr =
    props.index == 1
      ? 'fundational'
      : props.index == 2
      ? 'intermeidate'
      : 'advanced';

  return (
    <Grid item sm={4}>
      <Card
        variant="outlined"
        className={classes.imageCard}
        style={{
          height: `calc(280px + 20*${props.index}px)`,
          marginTop: `calc(20*${indexReverse}px)`
        }}
      >
        <>
          <Typography
            className={classes.cardHeader}
          >{`Unit ${props.index}`}</Typography>
          <Typography className={classes.cardSubHeader}>{headerStr}</Typography>
          <img
            src={props.image}
            alt="Paella dish"
            style={{ width: '100%', height: 'auto' }}
          />
        </>
      </Card>
      {props.contents &&
        props.contents.map(content => (
          <Typography className={classes.section} key={content}>
            {content}
          </Typography>
        ))}
      <div className={classes.section}>
        <p>$129/Unit</p>
        <p>4 Sessions for 4 Weeks</p>
      </div>
    </Grid>
  );
}
