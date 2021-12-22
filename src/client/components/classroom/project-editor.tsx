import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import { ApolloError, PureQueryOptions } from 'apollo-client';
import React from 'react';
import { MutationArgs } from '../../../types';
import { AddProjectThreadMutation } from '../../graphql/classroom-queries';
import CLButton from '../cl-button';
import CLTextInput from '../cl-text-input';
import ModalWrapper from '../modal-wrapper';
import PhotoUploader from '../pictures/photo-uploader';

export default function ProjectEditor(props: {
  studentId: string;
  classId: string;
  onError: (err: ApolloError) => void;
  refetchQuery: PureQueryOptions;
  onClose: () => void;
}) {
  const [description, setDescription] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [preview, setPreview] = React.useState('');
  const [published, setPublished] = React.useState(false);

  const [addProject, addProjectState] = useMutation<
    any,
    MutationArgs.AddProjectThread
  >(AddProjectThreadMutation, {
    onError: props.onError,
    onCompleted: props.onClose,
    refetchQueries: [props.refetchQuery]
  });

  return (
    <ModalWrapper
      open
      maxWidth="sm"
      fullWidth
      onClose={props.onClose}
      title="Share a Project"
    >
      <DialogContent>
        <CLTextInput
          name="title"
          label="Name your project"
          required
          value={title}
          onChange={evt => {
            setTitle(evt.target.value);
          }}
        />
        <CLTextInput
          name="description"
          label="Briefly describe how this project is done"
          variant="filled"
          required
          multiline
          rows={3}
          value={description}
          onChange={evt => {
            setDescription(evt.target.value);
          }}
        />
        <CLTextInput
          name="url"
          type="url"
          label="A link to where the project is hosted"
          placeholder="e.g. https://scratch.mit.edu/projects/269453003/"
          value={url}
          required
          style={{ marginBottom: 24 }}
          onChange={evt => {
            setUrl(evt.target.value);
          }}
        />
        <PhotoUploader onChange={setPreview} />
        <FormControl margin="normal">
          <FormControlLabel
            label="Make the project public?"
            control={
              <Switch
                checked={published}
                onChange={evt => setPublished(evt.target.checked)}
              />
            }
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <CLButton
          variant="contained"
          color="primary"
          loading={addProjectState.loading}
          onClick={() =>
            addProject({
              variables: {
                studentId: props.studentId,
                classId: props.classId,
                description,
                preview,
                url,
                title,
                published
              }
            })
          }
        >
          Submit
        </CLButton>
      </DialogActions>
    </ModalWrapper>
  );
}
