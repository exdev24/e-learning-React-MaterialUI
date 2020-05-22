import { useMutation } from '@apollo/react-hooks';
import { DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import React from 'react';
import ReactAvatarEditor from 'react-avatar-editor';
import { MutationArgs } from '../../../types';
import { Student } from '../../graphql/data-models';
import { EditStudentMutation } from '../../graphql/user-queries';
import CLButton from '../button';
import ModalWrapper from '../modal-wrapper';
import PhotoEditor from '../pictures/photo-editor';

interface Props {
  onClose: () => void;
  student: Student;
}

export default function EditStudentModal({ student, onClose }: Props) {
  const [error, setError] = React.useState('');
  const [changed, setChanged] = React.useState(false);
  const photoEditorRef = React.createRef<ReactAvatarEditor>();

  const [editStudent, editResult] = useMutation<
    { student: Student },
    MutationArgs.EditStudent
  >(EditStudentMutation, {
    onCompleted: onClose,
    onError(err) {
      setError((err.networkError || err).message);
    }
  });

  return (
    <ModalWrapper
      maxWidth="sm"
      fullWidth
      open
      onClose={onClose}
      title="Select a Picture"
    >
      <DialogContent>
        {error && (
          <DialogContentText color="error">
            Unexpected error: {error}, please try again later
          </DialogContentText>
        )}
        <PhotoEditor
          width={800}
          height={450}
          editorRef={photoEditorRef}
          src={student.cover}
          onChange={() => {
            setError('');
            setChanged(true);
          }}
        />
      </DialogContent>
      <DialogActions>
        <CLButton
          color="primary"
          loading={editResult.loading}
          disabled={!changed}
          variant="contained"
          onClick={() => {
            if (changed) {
              editStudent({
                variables: {
                  id: student.id,
                  childName: student.name,
                  school: student.school,
                  year: student.year,
                  gender: student.gender,
                  coverFile: photoEditorRef.current
                    .getImageScaledToCanvas()
                    .toDataURL()
                }
              });
            }
          }}
        >
          Save
        </CLButton>
      </DialogActions>
    </ModalWrapper>
  );
}
