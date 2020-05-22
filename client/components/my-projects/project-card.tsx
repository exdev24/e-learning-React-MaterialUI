import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton
} from '@material-ui/core';
import { Bookmark, MoreVert, OpenInBrowser } from '@material-ui/icons';
import React from 'react';
import { Project } from '../../graphql/data-models';
import { getTopicLink } from '../../lib/url-utils';
import NextMUIButton from '../next-mui-button';
import MediaPreview from '../pictures/media-preview';

interface Props {
  project: Project;
  onClickEdit?: () => void;
}

export default function ProjectCard({ project, onClickEdit }: Props) {
  return (
    <Card>
      <CardHeader
        title={project.title}
        subheader={project.published ? 'Published publicly' : 'Private to yourself'}
        action={
          onClickEdit && (
            <IconButton onClick={onClickEdit}>
              <MoreVert />
            </IconButton>
          )
        }
      />
      <MediaPreview src={project.preview} />
      <CardContent>{project.description}</CardContent>
      <CardActions>
        {project.subject && (
          <NextMUIButton color="secondary" next={getTopicLink(project.subject.id)}>
            <Bookmark style={{ marginRight: 8 }} />
            {project.subject.name}
          </NextMUIButton>
        )}
        <Button color="secondary" href={project.url}>
          <OpenInBrowser style={{ marginRight: 8 }} />
          Project
        </Button>
      </CardActions>
    </Card>
  );
}
