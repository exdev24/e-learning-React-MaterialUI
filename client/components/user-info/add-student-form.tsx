import { useMutation } from '@apollo/react-hooks';
import { Box, Grid, TextField } from '@material-ui/core';
import { addBreadcrumb, captureException } from 'sentry';
import React from 'react';
import ReactAvatarEditor from 'react-avatar-editor';
import { MutationArgs } from '../../../types';
import { transformGraphqlError } from '../../graphql/apollo';
import { Student } from '../../graphql/data-models';
import {
  AddStudentMutation,
  GetUserChildrenQuery,
  UserChildrenResponse
} from '../../graphql/user-queries';
import { birthYearProps, childNameProps } from '../../lib/input-fields';
import CLButton from '../button';
import CLTextInput from '../text-input';
import PhotoEditor from '../pictures/photo-editor';

type Data = {
  student: Student;
};

interface Props {
  onCompleted: (data: Data) => void;
  submitLabel: string;
}

export default function AddStudentForm({ onCompleted, submitLabel }: Props) {
  const [childName, setName] = React.useState('');
  const [school, setSchool] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [year, setYear] = React.useState<number>();
  const [errors, setErrors] = React.useState({});
  const [avatarChanged, setAvatarChanged] = React.useState(false);
  const avatarEditorRef = React.createRef<ReactAvatarEditor>();

  const [addStudent, addResult] = useMutation<Data, MutationArgs.AddStudent>(
    AddStudentMutation,
    {
      onCompleted,
      onError(err) {
        setErrors(transformGraphqlError(err).details);
      },
      update(cache, result) {
        const userData = cache.readQuery<UserChildrenResponse>({
          query: GetUserChildrenQuery
        });
        userData.user.children.push(result.data.student);
        cache.writeQuery({
          query: GetUserChildrenQuery,
          data: userData
        });
      }
    }
  );

  return (
    <form
      onSubmit={evt => {
        evt.preventDefault();
        setErrors({});

        const variables: MutationArgs.AddStudent = {
          childName,
          school,
          year
        };

        if (gender) {
          variables.gender = gender;
        }

        if (avatarChanged) {
          try {
            variables.avatarFile = avatarEditorRef.current
              .getImageScaledToCanvas()
              .toDataURL();
          } catch (err) {
            addBreadcrumb({
              message: 'failed to export avatar photo',
              data: variables
            });
            captureException(err);
          }
        }

        addStudent({ variables });
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PhotoEditor
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
            fullWidth
            margin="normal"
            helperText="Our class is best for student grade 2 and above"
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
            <option value=""></option>
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
        <CLButton
          loading={addResult.loading}
          color="primary"
          variant="contained"
          className="next_btn"
        >
          {submitLabel}
        </CLButton>
      </Box>
    </form>
  );
}
