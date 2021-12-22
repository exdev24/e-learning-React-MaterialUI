import { useMutation } from '@apollo/react-hooks';
import {
  CardContent,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  TextField
} from '@material-ui/core';
import { Close, Send } from '@material-ui/icons';
import { ApolloError, PureQueryOptions } from 'apollo-client';
import React from 'react';
import { IDVars, MutationArgs } from '../../../types';
import {
  AddCommentMutation,
  DeleteCommentMutation
} from '../../graphql/classroom-queries';
import { Comment } from '../../graphql/data-models';
import UserAvatar from '../user-avatar';

export default function ThreadCommentList(props: {
  studentId: string;
  threadId: string;
  comments: Comment[];
  onError: (err: ApolloError) => void;
  refetchQuery: PureQueryOptions;
}) {
  const [commentValue, setCommentValue] = React.useState('');

  const [addComment, addState] = useMutation<
    { comment: Comment },
    MutationArgs.AddComment
  >(AddCommentMutation, {
    onError: props.onError,
    onCompleted() {
      setCommentValue('');
    },
    variables: {
      threadId: props.threadId,
      studentId: props.studentId,
      content: commentValue
    },
    refetchQueries: [props.refetchQuery]
  });

  const [deleteComment, deleteState] = useMutation<boolean, IDVars>(
    DeleteCommentMutation,
    {
      onError: props.onError,
      refetchQueries: [props.refetchQuery]
    }
  );

  return (
    <CardContent>
      {props.comments.length > 0 && (
        <List dense subheader={<ListSubheader>Comments</ListSubheader>}>
          {props.comments.map(comment => (
            <ListItem key={comment.id} divider>
              <ListItemAvatar>
                <UserAvatar
                  style={{ width: 30, height: 30 }}
                  user={comment.author}
                />
              </ListItemAvatar>
              <ListItemText
                primary={comment.author.name}
                secondary={comment.content}
              />
              {comment.author.id === props.studentId && (
                <ListItemSecondaryAction>
                  <IconButton
                    disabled={deleteState.loading}
                    onClick={() =>
                      deleteComment({
                        variables: {
                          id: comment.id
                        }
                      })
                    }
                  >
                    <Close />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      )}
      <form
        onSubmit={evt => {
          evt.preventDefault();
          addComment();
        }}
      >
        <TextField
          required
          fullWidth
          disabled={addState.loading}
          size="small"
          value={commentValue}
          onChange={evt => setCommentValue(evt.target.value)}
          label="Add class comment..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={!commentValue} type="submit">
                  <Send />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </form>
    </CardContent>
  );
}
