import { useMutation } from '@apollo/react-hooks';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@material-ui/core';
import { MoreVert, OpenInBrowser } from '@material-ui/icons';
import { ApolloError, PureQueryOptions } from 'apollo-client';
import { DateTime } from 'luxon';
import React from 'react';
import { IDVars } from '../../../types';
import { DeleteThreadMutation } from '../../graphql/classroom-queries';
import { Thread } from '../../graphql/data-models';
import UserAvatar from '../user-avatar';
import ThreadCommentList from './thread-comment-list';

export default function ThreadItem(props: {
  studentId: string;
  thread: Thread;
  onError: (err: ApolloError) => void;
  refetchQuery: PureQueryOptions;
}) {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const [deleteThread, deleteThreadState] = useMutation<any, IDVars>(
    DeleteThreadMutation,
    {
      onError: props.onError,
      variables: { id: props.thread.id },
      refetchQueries: [props.refetchQuery]
    }
  );

  let threadAction: React.ReactNode = null;
  if (
    props.thread.comments.length === 0 &&
    props.thread.author.id === props.studentId
  ) {
    threadAction = (
      <IconButton onClick={evt => setMenuAnchor(evt.currentTarget)}>
        <MoreVert />
      </IconButton>
    );
  }

  return (
    <Card style={{ marginTop: 24 }}>
      <CardHeader
        avatar={<UserAvatar user={props.thread.author} />}
        title={props.thread.author?.name || '--'}
        subheader={DateTime.fromISO(props.thread.createdAt).toFormat('f')}
        action={threadAction}
      />
      <Menu
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          disabled={deleteThreadState.loading}
          onClick={() => deleteThread()}
        >
          Remove
        </MenuItem>
      </Menu>
      <CardContent>
        <Typography
          component="div"
          color="textSecondary"
          variant="body2"
          dangerouslySetInnerHTML={{ __html: props.thread.content }}
        />
        {props.thread.attachments.length > 0 && (
          <GridList cellHeight={128} cols={4} style={{ marginTop: 16 }}>
            {props.thread.attachments.map(attachment => (
              <GridListTile key={attachment}>
                <img src={attachment} />
                <GridListTileBar
                  actionIcon={
                    <IconButton href={attachment} target="_blank">
                      <OpenInBrowser style={{ color: 'rgba(255,255,255,0.85)' }} />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        )}
      </CardContent>
      <Divider />
      <ThreadCommentList
        studentId={props.studentId}
        threadId={props.thread.id}
        comments={props.thread.comments}
        refetchQuery={props.refetchQuery}
        onError={props.onError}
      />
    </Card>
  );
}
