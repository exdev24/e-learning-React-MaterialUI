import { useMutation } from '@apollo/react-hooks';
import { Chip, Grid } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import dynamic from 'next/dynamic';
import React from 'react';
import { sampleQuestions } from '../../../shared/constants';
import { MutationArgs } from '../../../types';
import {
  AddReactionMutation,
  ProjectDetailsQuery
} from '../../graphql/project-queries';

interface Props {
  isOwner: boolean;
  projectId: string;
}

const EmojiInput = dynamic(() => import('./emoji-input'), {
  ssr: false
});

export default function AddReaction(props: Props) {
  const [content, setContent] = React.useState('');

  const [addReaction, addResult] = useMutation<any, MutationArgs.AddReaction>(
    AddReactionMutation,
    {
      onCompleted() {
        setContent('');
      },
      refetchQueries: [
        {
          query: ProjectDetailsQuery,
          variables: {
            id: props.projectId
          }
        }
      ]
    }
  );

  const onSelectEmoji = emoji => {
    if (emoji.native) {
      setContent(content + emoji.native);
    }
  };

  const onSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    return addReaction({
      variables: {
        projectId: props.projectId,
        content
      }
    });
  };

  if (props.isOwner) {
    return (
      <form onSubmit={onSubmit}>
        <EmojiInput
          label="Leave a Comment"
          required={true}
          loading={addResult.loading}
          onSelectEmoji={onSelectEmoji}
          onChange={evt => setContent(evt.target.value)}
          value={content}
          multiline
          rows={3}
          variant="filled"
        />
      </form>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {sampleQuestions.map((q, idx) => (
          <Grid item xs="auto" key={idx}>
            <Chip
              label={q}
              variant="outlined"
              color="secondary"
              deleteIcon={<AddCircle />}
              onDelete={() => setContent(q)}
            />
          </Grid>
        ))}
      </Grid>
      <form onSubmit={onSubmit}>
        <EmojiInput
          label="Ask a quick quesion or express your reactions using Emojis"
          required={true}
          multiline
          rows={2}
          variant="filled"
          loading={addResult.loading}
          onSelectEmoji={onSelectEmoji}
          value={content}
        />
      </form>
    </>
  );
}
