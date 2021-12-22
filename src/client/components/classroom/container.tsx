import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';
import { VideoCallOutlined } from '@material-ui/icons';
import { ApolloError, PureQueryOptions } from 'apollo-client';
import dynamic from 'next/dynamic';
import React from 'react';
import { useAlert } from 'react-alert';
import { Classroom } from '../../../client/graphql/data-models';
import { routeIds, routePrefixes } from '../../../shared/constants';
import { parseErrorMessage } from '../../graphql/apollo';
import { GetClassroomThreadsQuery } from '../../graphql/classroom-queries';
import ContainerWrapper from '../container-wrapper';
import NextMUIButton from '../next-mui-button';
import UserAvatar from '../user-avatar';
import ProjectEditor from './project-editor';
import RoomHeader from './room-header';
import ThreadItem from './thread-item';

const PostEditor = dynamic(() => import('./post-editor'), {
  ssr: false
});

export default function ClassroomContainer(props: Classroom) {
  const alert = useAlert();
  const [editProject, setEditProject] = React.useState(false);

  const refetchQuery: PureQueryOptions = {
    query: GetClassroomThreadsQuery,
    variables: { id: props.id }
  };

  const onError = (err: ApolloError) => {
    alert.error(parseErrorMessage(err), {
      timeout: 10000
    });
  };

  if (!props.viewer) {
    return (
      <ContainerWrapper>
        <RoomHeader classroom={props} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            {props.teacher && (
              <Card style={{ marginBottom: 24 }}>
                <CardHeader
                  avatar={
                    <UserAvatar
                      user={props.teacher}
                      style={{ width: 48, height: 48 }}
                    />
                  }
                  title={props.teacher.fullName}
                  subheader={props.teacher.email}
                />
              </Card>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <TextField
                  multiline
                  rows={2}
                  fullWidth
                  variant="filled"
                  placeholder="Sign in to your Create & Learn Account to use Classroom"
                  InputProps={{ readOnly: true }}
                />
              </CardContent>
              <CardActions>
                <NextMUIButton
                  color="primary"
                  style={{ marginLeft: 'auto' }}
                  next={{
                    href: {
                      pathname: routeIds.signin,
                      query: {
                        next: routePrefixes.classroom + props.id
                      }
                    }
                  }}
                >
                  Login to Post
                </NextMUIButton>
              </CardActions>
            </Card>
            {props.threads.map(thread => (
              <ThreadItem
                key={thread.id}
                studentId=""
                refetchQuery={refetchQuery}
                thread={thread}
                onError={onError}
              />
            ))}
          </Grid>
        </Grid>
      </ContainerWrapper>
    );
  }

  return (
    <ContainerWrapper>
      <RoomHeader classroom={props} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          {props.teacher && (
            <Card style={{ marginBottom: 24 }}>
              <CardHeader
                avatar={
                  <UserAvatar
                    user={props.teacher}
                    style={{ width: 48, height: 48 }}
                  />
                }
                title={props.teacher.fullName}
                subheader={props.teacher.email}
              />
            </Card>
          )}

          <Fab
            variant="extended"
            color="secondary"
            size="small"
            href={props.dialInLink}
            style={{ width: '100%' }}
          >
            <VideoCallOutlined />
            &nbsp;&nbsp;Connect to Zoom
          </Fab>
          {props.zoomId && (
            <Typography variant="subtitle2" align="center">
              You should be connected to video conference automatically. Enter{' '}
              <u>{props.zoomId}</u> if the system asks you to enter Zoom ID.
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Tabs
            value={editProject ? 1 : 0}
            onChange={(evt, val) => setEditProject(Boolean(val))}
          >
            <Tab label="Comments" />
            <Tab label="Share Project" />
          </Tabs>
          {editProject ? (
            <ProjectEditor
              classId={props.id}
              studentId={props.viewer.id}
              onError={onError}
              refetchQuery={refetchQuery}
              onClose={() => setEditProject(false)}
            />
          ) : (
            <PostEditor
              classId={props.id}
              studentId={props.viewer.id}
              onError={onError}
              refetchQuery={refetchQuery}
            />
          )}

          {props.threads.map(thread => (
            <ThreadItem
              key={thread.id}
              studentId={props.viewer.id}
              refetchQuery={refetchQuery}
              thread={thread}
              onError={onError}
            />
          ))}
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
