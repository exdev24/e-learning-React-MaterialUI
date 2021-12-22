import { useMutation } from '@apollo/react-hooks';
import { Box, Button, Grid, TextField } from '@material-ui/core';
import React from 'react';
import ReactAvatarEditor from 'react-avatar-editor';
import { MutationArgs } from '../../../types';
import { transformGraphqlError } from '../../graphql/apollo';
import { Student } from '../../graphql/data-models';
import { EditStudentMutation } from '../../graphql/user-queries';
import { birthYearProps, childNameProps } from '../../lib/input-fields';
import CLButton from '../cl-button';
import CLTextInput from '../cl-text-input';
import ModalWrapper from '../modal-wrapper';
import PhotoEditor from '../pictures/photo-editor';

interface Props {
  onDelete: () => void;
  onClose: () => void;
  student: Student;
}

export default function EditStudentModal({ student, onClose, onDelete }: Props) {
  const [childName, setName] = React.useState(student.name);
  const [school, setSchool] = React.useState(student.school);
  const [gender, setGender] = React.useState(student.gender);
  const [year, setYear] = React.useState(student.year);
  const [errors, setErrors] = React.useState({});

  const [avatarChanged, setAvatarChanged] = React.useState(false);
  const avatarEditorRef = React.createRef<ReactAvatarEditor>();

  const [editStudent, editResult] = useMutation<
    { student: Student },
    MutationArgs.EditStudent
  >(EditStudentMutation, {
    onCompleted: onClose,
    onError(err) {
      setErrors(transformGraphqlError(err).details);
    }
  });

  return (
    <ModalWrapper maxWidth="md" open title="Edit Student" onClose={onClose}>
      <Box
        component="form"
        my={1}
        mx={3}
        onSubmit={evt => {
          evt.preventDefault();
          setErrors({});

          const variables: MutationArgs.EditStudent = {
            id: student.id,
            childName,
            school,
            year
          };

          if (gender) {
            variables.gender = gender;
          }

          if (avatarChanged) {
            variables.avatarFile = avatarEditorRef.current
              .getImageScaledToCanvas()
              .toDataURL();
          }

          editStudent({ variables });
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <PhotoEditor
              src={student.avatar}
              editorRef={avatarEditorRef}
              onChange={() => setAvatarChanged(true)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CLTextInput
              {...childNameProps}
              required
              fullWidth
              value={childName}
              margin="normal"
              errors={errors}
              onChange={evt => {
                setName(evt.target.value);
                setErrors({});
              }}
            />

            <CLTextInput
              {...birthYearProps}
              required
              fullWidth
              margin="normal"
              value={year}
              errors={errors}
              onChange={evt => {
                setYear(+evt.target.value);
                setErrors({});
              }}
            />

            <TextField
              label="Gender"
              value={gender}
              fullWidth
              margin="normal"
              select
              SelectProps={{
                native: true
              }}
              onChange={evt => {
                setGender(evt.target.value);
                setErrors({});
              }}
            >
              <option value="" disabled></option>
              <option value="male">Boy</option>
              <option value="female">Girl</option>
            </TextField>

            <CLTextInput
              name="school"
              label="Name of your School"
              fullWidth
              margin="normal"
              value={school}
              errors={errors}
              onChange={evt => {
                setSchool(evt.target.value);
                setErrors({});
              }}
            />
          </Grid>
        </Grid>
        <Box mt={3} textAlign="right">
          <Button color="primary" onClick={onDelete}>
            Delete
          </Button>
          <CLButton loading={editResult.loading} color="primary" variant="contained">
            Update
          </CLButton>
        </Box>
      </Box>
    </ModalWrapper>
  );
}
