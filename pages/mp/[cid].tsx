import { useQuery } from '@apollo/react-hooks';
import { Box, CardHeader, Container, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import Layout from '../../client/components/layout';
import ProjectCard from '../../client/components/my-projects/project-card';
import PreflightCheck from '../../client/components/preflight-check';
import UserAvatar from '../../client/components/user-avatar';
import {
  MakerProfileQuery,
  MakerProfileResult
} from '../../client/graphql/user-queries';
import { defaultCoverUrl } from '../../shared/constants';
import { IDVars } from '../../types';

const useStyles = makeStyles(theme => ({
  cover: {
    height: 0,
    paddingTop: '56.25%',
    marginTop: theme.spacing(4),
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: theme.shape.borderRadius,
    '&>div': {
      position: 'absolute',
      backgroundColor: theme.palette.grey[100],
      bottom: 0,
      left: 0,
      width: '100%'
    }
  },
  projedcts: {
    margin: theme.spacing(4, 0)
  }
}));

export default function MakerPager(props: { cid: string }) {
  const classes = useStyles({});
  const result = useQuery<MakerProfileResult, IDVars>(MakerProfileQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { id: props.cid }
  });

  if (!result.data) {
    return <PreflightCheck loading={result.loading} error={result.error} />;
  }

  const { maker } = result.data;
  const coverImage = maker.cover || defaultCoverUrl;

  return (
    <Layout title={`${maker.name}'s Portfolio`} image={coverImage}>
      <Container maxWidth="md">
        <div
          className={classes.cover}
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <CardHeader
            avatar={<UserAvatar user={maker} />}
            title={maker.name}
            subheader="Maker's portfolio"
          />
        </div>
        <div className={classes.projedcts}>
          {maker.projects.length === 0 ? (
            <Box p={4} textAlign="center" borderRadius={4} border="1px dashed #ddd">
              {maker.name} has not published any project yet
            </Box>
          ) : (
            <Grid container spacing={4}>
              {maker.projects.map(project => (
                <Grid key={project.id} item xs={12} md={6}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </Container>
    </Layout>
  );
}
