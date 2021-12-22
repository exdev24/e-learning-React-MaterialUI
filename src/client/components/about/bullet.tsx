import { Grid } from '@material-ui/core';
import React from 'react';

interface Props {
  children: React.ReactNode;
  image: {
    src: string;
    style?: React.CSSProperties;
  };
  alignLeft: boolean;
  title: string;
}

export default function Bullet(props: Props) {
  const mainElement = (
    <Grid item xs={12} md={7}>
      {props.children}
    </Grid>
  );

  const imageElement = (
    <Grid item xs={12} md={5}>
      <img
        src={props.image.src}
        style={{ maxHeight: 196, ...props.image.style }}
        alt={props.title}
      />
    </Grid>
  );

  return props.alignLeft ? (
    <Grid container alignItems="center" spacing={5}>
      {mainElement}
      {imageElement}
    </Grid>
  ) : (
    <Grid container alignItems="center" spacing={5}>
      {imageElement}
      {mainElement}
    </Grid>
  );
}

Bullet.defaultProps = {
  alignLeft: true
};
