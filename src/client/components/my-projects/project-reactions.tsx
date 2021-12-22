import { useMutation } from '@apollo/react-hooks';
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@material-ui/core';
import { Delete, FaceTwoTone } from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { IDVars } from '../../../types';
import {
  DeleteReactionMutation,
  ProjectDetailsQuery,
  ProjectDetailsResult
} from '../../graphql/project-queries';

interface Props extends ProjectDetailsResult {
  userId?: string;
}

export default function ProjectReactions({ project, userId }: Props) {
  const [deleteReaction, deleteResult] = useMutation<any, IDVars>(
    DeleteReactionMutation,
    {
      refetchQueries: [
        {
          query: ProjectDetailsQuery,
          variables: {
            id: project.id
          }
        }
      ]
    }
  );

  return (
    <List disablePadding>
      {project.reactions.map(reaction => {
        const isAuthor = reaction.user.id === userId;

        return (
          <ListItem key={reaction.id} divider>
            <ListItemIcon>
              <FaceTwoTone color={isAuthor ? 'primary' : 'inherit'} />
            </ListItemIcon>

            <ListItemText
              primary={reaction.content}
              secondary={
                <>
                  {isAuthor || `${reaction.user.firstName} - `}
                  <Typography variant="caption">
                    {DateTime.fromISO(reaction.createdAt).toFormat('ff')}
                  </Typography>
                </>
              }
            />
            {isAuthor && (
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  disabled={deleteResult.loading}
                  onClick={() =>
                    deleteReaction({
                      variables: { id: reaction.id }
                    })
                  }
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        );
      })}
    </List>
  );
}
