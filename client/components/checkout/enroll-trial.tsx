import { useMutation } from '@apollo/react-hooks';
import { Container, Typography } from '@material-ui/core';
import React from 'react';
import { routeIds } from '../../../shared/constants';
import { MutationArgs } from '../../../types';
import { CheckoutContext } from '../../context/checkout';
import { Student } from '../../graphql/data-models';
import {
  EnrollTrialMutation,
  GetUserWithClassResponse
} from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
import { getUserTraits } from '../../lib/user-source';
import NextMUILink from '../next-mui-link';
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

  if (!props.user.canEnrollTrial) {
    return (
      <ReviewClass klass={props.klass}>
        <Typography>
          {
            'We appreciate that you love our classes. At this time, because of the high demand, we are limiting the maximum number of free sessions per family so more children can access our classes. We hope to support more demand soon. In the mean time, '
          }
          <NextMUILink color="secondary" next={{ href: routeIds.camp }}>
            check out our online camps
          </NextMUILink>
          {" to level up your child's learning."}
        </Typography>
      </ReviewClass>
    );
  }

  if (activeStep === 0) {
    return (
      <ReviewClass klass={props.klass}>
        <ConfirmStudent
          klass={props.klass}
          user={props.user}
          selected={student}
          isSubmitting={enrollResult.loading}
          selectStudent={selectStudent}
          handleStudentAdded={(s: Student) => {
            const traits = getUserTraits();
            handleEnrollClass({
              variables: {
                classId: props.klass.id,
                studentId: s.id,
                source: traits.source,
                campaign: traits.campaign
              }
            });
          }}
          handleStudentConfirmed={() => {
            const traits = getUserTraits();
            handleEnrollClass({
              variables: {
                classId: props.klass.id,
                studentId: student.id,
                source: traits.source,
                campaign: traits.campaign
              }
            });
          }}
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
