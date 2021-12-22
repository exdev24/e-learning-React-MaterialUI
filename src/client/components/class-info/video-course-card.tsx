import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React from 'react';
import { Course } from '../../graphql/data-models';
import EmbedVideo from '../embed-video';
import SocialBar from '../social-bar';

export default function VideoCourseCard(props: { course: Course }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <Card>
      <CardMedia>
        <EmbedVideo src={props.course.recording} />
      </CardMedia>
      <CardContent style={{ padding: '8px 16px' }}>
        <Typography variant="h6">{props.course.name}</Typography>
        <Typography variant="body2">{props.course.info}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <SocialBar
          url={props.course.recording}
          placeholder={props.course.description}
          actionLabel="Openclass"
        />
        <IconButton
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <ExpandMore />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {props.course.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
