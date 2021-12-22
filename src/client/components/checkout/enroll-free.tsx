import { useMutation } from '@apollo/react-hooks';
import { Box, Checkbox, Container, FormControlLabel } from '@material-ui/core';
import { Topic } from 'cl-common';
import React from 'react';
import { MutationArgs } from '../../../types';
import { CheckoutContext } from '../../context/checkout';
import {
  EnrollTrialMutation,
  GetUserWithClassResponse
} from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
import PostEnrollmentShare from '../post-enrollment-share';
import ConfirmStudent from './confirm-student';
import ReviewClass from './review-class';

export default function EnrollFree(props: GetUserWithClassResponse) {
  const {
    activeStep,
    handleGoNext,
    student,
    handleError,
    source,
    campaign
  } = React.useContext(CheckoutContext);

  let defaultChecked = false;
  let optInInfo = '';

  switch (props.klass.course.subjectId) {
    case Topic.WEBINARS:
      optInInfo =
        'Enjoying Open Classes? Opt-in here to be automatically invited to future ones.';
      if (student?.webinar) {
        defaultChecked = true;
      }
      break;
    case Topic.PE:
      optInInfo =
        'Enjoying CloudPE? Opt-in here to be automatically invited to future ones.';
      if (student?.pe) {
        defaultChecked = true;
      }
      break;
  }

  const [optIn, toggleOptIn] = React.useState(defaultChecked);

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
        {optInInfo && (
          <Box pb={3}>
            <FormControlLabel
              control={<Checkbox />}
              checked={optIn}
              onChange={(evt, checked) => toggleOptIn(checked)}
              label={optInInfo}
            />
          </Box>
        )}

        <ConfirmStudent
          klass={props.klass}
          user={props.user}
          loading={enrollResult.loading}
          onConfirmed={s =>
            handleEnrollClass({
              variables: {
                source,
                campaign,
                classId: props.klass.id,
                studentId: s.id,
                optIn
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
