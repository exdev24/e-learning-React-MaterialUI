import { useQuery } from '@apollo/react-hooks';
import {
  Box,
  Button,
  CardHeader,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import React from 'react';
import Layout from '../../client/components/layout';
import ProjectCard from '../../client/components/my-projects/project-card';
import PreflightCheck from '../../client/components/preflight-check';
import UserAvatar from '../../client/components/user-avatar';
import SharePortfolioModal from '../../client/components/my-projects/share-portfolio-modal';
import {
  MakerProfileQuery,
  MakerProfileResult
} from '../../client/graphql/user-queries';
import { defaultCoverUrl } from '../../shared/constants';
import { IDVars } from '../../types';
import { DateTime } from 'luxon';

const useStyles = makeStyles(theme => ({
  cover: {
    height: 0,
    paddingTop: '40%',
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

export default function MakerPager(props: { id: string }) {
  const classes = useStyles({});
  const [shareProfile, selectShareProfile] = React.useState(false);

  const result = useQuery<MakerProfileResult, IDVars>(MakerProfileQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { id: props.id }
  });

  if (!result.data) {
    return <PreflightCheck loading={result.loading} error={result.error} />;
  }

  const { maker } = result.data;
  if (!maker) {
    return <PreflightCheck statusCode={404} />;
  }

  const coverImage = maker.cover || defaultCoverUrl;

  return (
    <Layout title={`${maker.name}'s Portfolio`} image={coverImage}>
      {shareProfile && (
        <SharePortfolioModal
          open
          student={maker}
          onClose={() => selectShareProfile(false)}
        />
      )}
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
              <Grid item xs={12} md={12} style={{ textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => selectShareProfile(true)}
                >
                  Share Portfolio
                </Button>
              </Grid>
              {maker.projects.map(project => (
                <Grid key={project.id} item xs={12} md={6}>
                  <ProjectCard
                    project={project}
                    headerProps={{
                      subheader: DateTime.fromISO(project.createdAt).toFormat('ff')
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </Container>
    </Layout>
  );
}
