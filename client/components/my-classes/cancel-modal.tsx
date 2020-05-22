import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import { PureQueryOptions } from 'apollo-client';
import React from 'react';
import { contactEmail } from '../../../shared/constants';
import { IDVars } from '../../../types';
import { Registration } from '../../graphql/data-models';
import { CancelEnrollmentMutation } from '../../graphql/enrollment-queries';
import CLButton from '../button';
import ModalWrapper from '../modal-wrapper';

interface Props {
  registration: Registration;
  onClose: () => void;
  refetchQuery: PureQueryOptions;
}

export default function CancelModal(props: Props) {
  const [cancelClass, cancelStatus] = useMutation<boolean, IDVars>(
    CancelEnrollmentMutation,
    {
      onCompleted: props.onClose,
      refetchQueries: [props.refetchQuery]
    }
  );

  if (props.registration.class.course.price > 0) {
    return (
      <ModalWrapper title="Contact for help" open onClose={props.onClose}>
        <DialogContent>
          <DialogContentText>
            To cancel your registration for&nbsp;
            <strong>{props.registration.class.course.name}</strong> and request a
            refund, please email us at {contactEmail}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper
      title="Sure to remove your registration?"
      open
      onClose={props.onClose}
    >
      <DialogContent>
        <DialogContentText>
          If you prefer a different time, use reschedule instead.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Keep the class</Button>
        <CLButton
          color="primary"
          variant="contained"
          loading={cancelStatus.loading}
          onClick={() =>
            cancelClass({
              variables: {
                id: props.registration.id
              }
            })
          }
        >
          Yes, cancel please
        </CLButton>
      </DialogActions>
    </ModalWrapper>
  );
}
