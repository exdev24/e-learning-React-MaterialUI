import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider
} from '@material-ui/core';
import NextLink, { LinkProps } from 'next/link';
import React from 'react';
import NextMUIButton from '../next-mui-button';

interface Props {
  thumbnail: string;
  title: string;
  subtitle: string;
  grades: [number, number];
  linkLabel: string;
  linkProps: LinkProps;
}

export default function ThumbnailNavItem(props: Props) {
  return (
    <Card>
      <NextLink {...props.linkProps}>
        <CardActionArea>
          <CardMedia
            image={props.thumbnail}
            style={{ height: 0, paddingTop: '62.5%' }}
          />
        </CardActionArea>
      </NextLink>
      <CardHeader
        title={props.title}
        subheader={`Grades ${props.grades.join('-')}`}
      />
      <Divider />
      <CardContent>{props.subtitle}</CardContent>
      <CardActions>
        <NextMUIButton
          color="primary"
          variant="contained"
          fullWidth
          className="check-schedule-enroll"
          next={props.linkProps}
        >
          {props.linkLabel}
        </NextMUIButton>
      </CardActions>
    </Card>
  );
}
