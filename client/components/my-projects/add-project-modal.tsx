import { useMutation } from '@apollo/react-hooks';
import { Box, FormControl, FormControlLabel, Switch } from '@material-ui/core';
import React from 'react';
import { useAlert } from 'react-alert';
import { MutationArgs } from '../../../types';
import { Project } from '../../graphql/data-models';
import {
  AddProjectMutation,
  StudentProjectsQuery
} from '../../graphql/user-queries';
import CLButton from '../button';
import CLTextInput from '../text-input';
import ModalWrapper from '../modal-wrapper';
import PhotoUploader from '../pictures/photo-uploader';
import SubjectSelector from './subject-selector';

interface ModalProps {
  studentId: string;
  onClose: () => void;
}

export default function AddProjectModal(props: ModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [preview, setPreview] = React.useState('');
  const [subjectId, setSubjectId] = React.useState('');
  const [published, setPublished] = React.useState(false);

  const alert = useAlert();
  const [addProject, addResult] = useMutation<
    { addProject: Project },
    MutationArgs.AddProject
  >(AddProjectMutation, {
    onCompleted: props.onClose,
    onError() {
      alert.error('fail to add project, please fix error and try again');
    },
    update(cache, result) {
      const data = cache.readQuery<{
        student: { id: string; projects: Project[] };
      }>({
        query: StudentProjectsQuery,
        variables: {
          id: props.studentId
        }
      });

      data.student.projects.push(result.data.addProject);
      cache.writeQuery({
        query: StudentProjectsQuery,
        variables: {
          id: props.studentId
        },
        data
      });
    }
  });

  return (
    <ModalWrapper open onClose={props.onClose} title="Add a Project">
      <form
        onSubmit={evt => {
          evt.preventDefault();
          addProject({
            variables: {
              title,
              description,
              url,
              preview,
              published,
              subjectId,
              studentId: props.studentId
            }
          });
        }}
      >
        <Box px={3}>
          <CLTextInput
            name="title"
            label="Name your project"
            margin="normal"
            required
            value={title}
            onChange={evt => {
              setTitle(evt.target.value);
            }}
          />
          <CLTextInput
            name="description"
            label="Briefly describe how this project is done"
            margin="normal"
            required
            multiline
            rows={3}
            value={description}
            onChange={evt => {
              setDescription(evt.target.value);
            }}
          />
          <PhotoUploader onChange={(url, added) => setPreview(added ? url : '')} />
          <CLTextInput
            name="url"
            type="url"
            margin="normal"
            label="A link to where the project is hosted"
            placeholder="e.g. https://scratch.mit.edu/projects/269453003/"
            value={url}
            required
            onChange={evt => {
              setUrl(evt.target.value);
            }}
          />
          <SubjectSelector
            value={subjectId}
            onChange={setSubjectId}
            margin="normal"
            label="What class did you take"
            fullWidth
          />
          <FormControl margin="normal">
            <FormControlLabel
              label="Make this public?"
              control={
                <Switch
                  checked={published}
                  onChange={evt => setPublished(evt.target.checked)}
                />
              }
            />
          </FormControl>
        </Box>
        <Box px={3} py={2} textAlign="right">
          <CLButton
            loading={addResult.loading}
            disabled={!title || !description || !preview}
            color="primary"
            variant="contained"
          >
            Submit
          </CLButton>
        </Box>
      </form>
    </ModalWrapper>
  );
}
