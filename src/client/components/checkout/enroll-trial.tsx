import { useMutation } from '@apollo/react-hooks';
import { Container } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Topic } from 'cl-common';
import React from 'react';
import { routeIds } from '../../../shared/constants';
import { MutationArgs } from '../../../types';
import { CheckoutContext } from '../../context/checkout';
import {
  EnrollTrialMutation,
  GetUserWithClassResponse
} from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
import { hasTrialQuota, whitelistedForRobot } from '../../lib/checkout-helper';
import NextMUILink from '../next-mui-link';
import PostEnrollmentShare from '../post-enrollment-share';
import ConfirmStudent from './confirm-student';
import ReviewClass from './review-class';

export default function EnrollTrial(props: GetUserWithClassResponse) {
  const {
    activeStep,
    handleGoNext,
    handleError,
    source,
    campaign
  } = React.useContext(CheckoutContext);

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

  if (!hasTrialQuota(props.user)) {
    return (
      <ReviewClass klass={props.klass}>
        <Alert color="warning">
          {
            'We appreciate that you love our classes. At this time, because of the high demand, we are limiting the maximum number of free sessions per family so more children can access our classes. We hope to support more demand soon. In the mean time, '
          }
          <NextMUILink
            color="secondary"
            next={{ href: routeIds.camp }}
            title="check out our online camps"
          >
            check out our online camps
          </NextMUILink>
          {" to level up your child's learning."}
        </Alert>
      </ReviewClass>
    );
  }

  if (
    props.klass.course.subjectId === Topic.ROBO &&
    !whitelistedForRobot(props.user.children)
  ) {
    return (
      <ReviewClass klass={props.klass}>
        <Alert color="warning">
          {
            'This free introduction class is only eligible for students who have taken our Scratch Ninja 1-2, Accelerated Scratch 1-2, or Minecraft coding 1-2 classes'
          }
        </Alert>
      </ReviewClass>
    );
  }

  if (activeStep === 0) {
    return (
      <ReviewClass klass={props.klass}>
        <ConfirmStudent
          klass={props.klass}
          user={props.user}
          loading={enrollResult.loading}
          onConfirmed={s =>
            handleEnrollClass({
              variables: {
                classId: props.klass.id,
                studentId: s.id,
                source,
                campaign
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
