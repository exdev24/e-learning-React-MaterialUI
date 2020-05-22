import { useMutation } from '@apollo/react-hooks';
import { DialogActions, DialogContent } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { routeIds } from '../../../shared/constants';
import { IDVars } from '../../../types';
import { Student } from '../../graphql/data-models';
import {
  GetUserChildrenQuery,
  RemoveStudentMutation,
  UserChildrenResponse
} from '../../graphql/user-queries';
import CLButton from '../button';
import ModalWrapper from '../modal-wrapper';

interface Pros {
  student: Student;
  onClose: () => void;
}

export default function DeleteStudentModal({ student, onClose }: Pros) {
  const router = useRouter();

  const [removeStudent, removeResult] = useMutation<any, IDVars>(
    RemoveStudentMutation,
    {
      onCompleted() {
        router.replace(routeIds.account);
      },
      variables: {
        id: student.id
      },
      update(cache) {
        const userData = cache.readQuery<UserChildrenResponse>({
          query: GetUserChildrenQuery
        });
        userData.user.children = userData.user.children.filter(
          child => child.id !== student.id
        );
        cache.writeQuery({
          query: GetUserChildrenQuery,
          data: userData
        });
      }
    }
  );

  return (
    <ModalWrapper open title="Confirm Deletion" onClose={onClose}>
      <DialogContent>
        Please confirm that you would like to remove this student from our system.
        This action cannot be reverted once it is confirmed.
      </DialogContent>
      <DialogActions>
        <CLButton
          type="button"
          color="primary"
          variant="contained"
          loading={removeResult.loading}
          onClick={() => removeStudent()}
        >
          Confirm
        </CLButton>
      </DialogActions>
    </ModalWrapper>
  );
}
