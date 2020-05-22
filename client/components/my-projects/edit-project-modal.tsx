import { useMutation } from '@apollo/react-hooks';
import { Box, FormControl, FormControlLabel, Switch } from '@material-ui/core';
import React from 'react';
import { useAlert } from 'react-alert';
import { MutationArgs } from '../../../types';
import { Project } from '../../graphql/data-models';
import { EditProjectMutation } from '../../graphql/user-queries';
import CLButton from '../button';
import CLTextInput from '../text-input';
import ModalWrapper from '../modal-wrapper';
import MediaPreview from '../pictures/media-preview';
import PhotoUploader from '../pictures/photo-uploader';
import SubjectSelector from './subject-selector';

interface ModalProps {
  open: boolean;
  project: Project;
  onClose: () => void;
}

export default function EditProjectModal(props: ModalProps) {
  const [title, setTitle] = React.useState(props.project.title);
  const [description, setDescription] = React.useState(props.project.description);
  const [url, setUrl] = React.useState(props.project.url);
  const [preview, setPreview] = React.useState(props.project.preview);
  const [published, setPublished] = React.useState(props.project.published);
  const [subjectId, setSubjectId] = React.useState(
    props.project.subject ? props.project.subject.id : ''
  );

  const alert = useAlert();
  const [editProject, editResult] = useMutation<any, MutationArgs.EditProject>(
    EditProjectMutation,
    {
      onCompleted: props.onClose,
      onError() {
        alert.error('fail to edit project, please fix error and try again');
      }
    }
  );

  return (
    <ModalWrapper open={props.open} onClose={props.onClose} title="Update Project">
      <form
        onSubmit={evt => {
          evt.preventDefault();
          editProject({
            variables: {
              id: props.project.id,
              title,
              description,
              url,
              preview,
              published,
              subjectId
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

          <Box mt={2} mb={1}>
            <MediaPreview src={preview} />
          </Box>
          <PhotoUploader
            onChange={(fileUrl, added) =>
              setPreview(added ? fileUrl : props.project.preview)
            }
          />

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
            loading={editResult.loading}
            disabled={!title || !description || !preview}
            color="primary"
            variant="contained"
          >
            Save
          </CLButton>
        </Box>
      </form>
    </ModalWrapper>
  );
}
