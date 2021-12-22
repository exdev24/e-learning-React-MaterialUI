import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardHeaderProps,
  IconButton
} from '@material-ui/core';
import { LinkOutlined, ShareOutlined } from '@material-ui/icons';
import React from 'react';
import { Project } from '../../graphql/data-models';
import MediaPreview from '../pictures/media-preview';
import ShareProjectModal from './share-project-modal';
import NextMUIButton from '../next-mui-button';
import { routeIds, routePrefixes } from '../../../shared/constants';

interface Props {
  project: Project;
  headerProps: CardHeaderProps;
}

export default function ProjectCard({ project, headerProps }: Props) {
  const [isSharing, toggleSharing] = React.useState(false);

  return (
    <Card>
      <ShareProjectModal
        onClose={() => toggleSharing(false)}
        open={isSharing}
        project={project}
      />
      <CardHeader title={project.title} {...headerProps} />

      <MediaPreview src={project.preview} />
      <CardContent>{project.description}</CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <NextMUIButton
          variant="contained"
          next={{ as: routePrefixes.project + project.id, href: routeIds.project }}
        >
          View More
        </NextMUIButton>

        <div style={{ marginLeft: 'auto' }}>
          {project.url && (
            <IconButton color="secondary" target="_blank" href={project.url}>
              <LinkOutlined />
            </IconButton>
          )}
          {project.published && (
            <IconButton
              color="secondary"
              onClick={() => toggleSharing(true)}
              title="Share Project"
            >
              <ShareOutlined />
            </IconButton>
          )}
        </div>
      </CardActions>
    </Card>
  );
}
