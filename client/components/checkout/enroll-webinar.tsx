import { useMutation } from '@apollo/react-hooks';
import { Box, Checkbox, Container, FormControlLabel } from '@material-ui/core';
import React from 'react';
import { MutationArgs } from '../../../types';
import { CheckoutContext } from '../../context/checkout';
import { Student } from '../../graphql/data-models';
import {
  EnrollTrialMutation,
  GetUserWithClassResponse
} from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
import PostEnrollmentShare from '../post-enrollment-share';
import ConfirmStudent from './confirm-student';
import ReviewClass from './review-class';

export default function EnrollTrial(props: GetUserWithClassResponse) {
  const {
    activeStep,
    handleGoNext,
    student,
    selectStudent,
    handleError
  } = React.useContext(CheckoutContext);

  const [webinarOptIn, setWebinarOptIn] = React.useState(student?.webinar ?? true);
  const [handleEnrollClass, enrollResult] = useMutation<
    any,
    MutationArgs.EnrollTrial
  >(EnrollTrialMutation, {
    onError: handleError,
    onCompleted() {
      logEvent('StartTrial', {
        content_name: props.klass.course.name,
        content_ids: [props.klass.courseId],
        content_type: 'product'
      });
      handleGoNext();
    }
  });

  if (activeStep === 0) {
    return (
      <ReviewClass klass={props.klass}>
        <Box pb={3}>
          <FormControlLabel
            control={<Checkbox />}
            checked={webinarOptIn}
            onChange={(evt, checked) => setWebinarOptIn(checked)}
            label="Enjoying open classes? Opt-in here to be automatically invited to future ones."
          />
        </Box>

        <ConfirmStudent
          klass={props.klass}
          user={props.user}
          selected={student}
          isSubmitting={enrollResult.loading}
          selectStudent={selectStudent}
          handleStudentAdded={(s: Student) =>
            handleEnrollClass({
              variables: {
                classId: props.klass.id,
                studentId: s.id,
                webinarOptIn
              }
            })
          }
          handleStudentConfirmed={() =>
            handleEnrollClass({
              variables: {
                classId: props.klass.id,
                studentId: student?.id,
                webinarOptIn
              }
            })
          }
        />
      </ReviewClass>
    );
  }

  return (
    <Container maxWidth="md">
      <PostEnrollmentShare course={props.klass.course} />
    </Container>
  );
}
