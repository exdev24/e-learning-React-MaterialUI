import { useQuery } from '@apollo/react-hooks';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Typography
} from '@material-ui/core';
import { ShareOutlined } from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import Layout from '../../client/components/layout';
import MainSection from '../../client/components/main-section';
import AddReaction from '../../client/components/my-projects/add-reaction';
import ProjectReactions from '../../client/components/my-projects/project-reactions';
import ShareProjectModal from '../../client/components/my-projects/share-project-modal';
import NextMUILink from '../../client/components/next-mui-link';
import MediaPreview from '../../client/components/pictures/media-preview';
import PreflightCheck from '../../client/components/preflight-check';
import { AccountContext } from '../../client/context/account';
import {
  ProjectDetailsQuery,
  ProjectDetailsResult
} from '../../client/graphql/project-queries';
import { getMakerLink } from '../../client/lib/url-utils';
import { routeIds, routePrefixes } from '../../shared/constants';
import { IDVars } from '../../types';

export default function ProjectDetailPage(props: { id: string }) {
  const { user } = React.useContext(AccountContext);
  const [isSharing, toggleSharing] = React.useState(false);

  const result = useQuery<ProjectDetailsResult, IDVars>(ProjectDetailsQuery, {
    variables: { id: props.id }
  });

  if (!result.data) {
    return <PreflightCheck loading={result.loading} error={result.error} />;
  }

  const { project } = result.data;
  if (!project) {
    return <PreflightCheck statusCode={404} />;
  }

  return (
    <Layout
      title={project.title}
      description={project.description}
      image={project.preview}
    >
      <ShareProjectModal
        open={isSharing}
        project={project}
        onClose={() => toggleSharing(false)}
      />
      <Container maxWidth="md">
        <Card variant="outlined" style={{ margin: '2rem 0' }}>
          <CardHeader
            title={project.title}
            subheader={
              <>
                <NextMUILink
                  color="secondary"
                  variant="subtitle1"
                  next={getMakerLink(project.student)}
                >
                  Created by <strong>{project.student.name}</strong>
                </NextMUILink>
                <Typography variant="subtitle2">
                  {DateTime.fromISO(project.createdAt).toFormat('ff')}
                </Typography>
              </>
            }
            action={
              <IconButton
                color="secondary"
                onClick={() => toggleSharing(true)}
                title="Share Project"
              >
                <ShareOutlined />
              </IconButton>
            }
          />
          <CardContent>
            <MediaPreview src={project.preview} />
          </CardContent>
          <CardContent>{project.description}</CardContent>
        </Card>
      </Container>
      {user ? (
        <MainSection
          maxWidth="md"
          stripe
          header={<Typography variant="h4">Comments and Reactions</Typography>}
        >
          <AddReaction isOwner={project.isOwner} projectId={project.id} />
          <ProjectReactions project={project} userId={user.id} />
        </MainSection>
      ) : (
        <MainSection
          maxWidth="md"
          stripe
          header={
            <NextMUILink
              variant="h5"
              next={{
                href: {
                  pathname: routeIds.signup,
                  query: {
                    next: routePrefixes.project + project.id
                  }
                }
              }}
            >
              Create an Account to Join the Conversation
            </NextMUILink>
          }
        >
          <ProjectReactions project={project} />
        </MainSection>
      )}
    </Layout>
  );
}
