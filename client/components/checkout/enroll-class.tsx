import { useMutation } from '@apollo/react-hooks';
import { Container, Typography } from '@material-ui/core';
import React from 'react';
import { MutationArgs } from '../../../types';
import { CheckoutContext } from '../../context/checkout';
import {
  EnrollClassMutation,
  GetUserWithClassResponse
} from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
import { getUserTraits } from '../../lib/user-source';
import PostEnrollmentShare from '../post-enrollment-share';
import BundleOption from './bundle-option';
import ConfirmStudent from './confirm-student';
import MakePurchase from './make-purchase';
import ReviewClass from './review-class';
import Upsales from './upsales';

export default function EnrollClass(props: GetUserWithClassResponse) {
  const {
    activeStep,
    coupon,
    klasses,
    student,
    selectStudent,
    handleError,
    handleGoNext,
    toggleAddon,
    priceBreakdown
  } = React.useContext(CheckoutContext);

  const [enrollClass, enrollState] = useMutation<any, MutationArgs.EnrollClass>(
    EnrollClassMutation,
    {
      onError: handleError,
      onCompleted() {
        logEvent('Purchase', {
          content_name: props.klass.course.name,
          content_ids: klasses.map(kls => kls.courseId),
          content_type: klasses.length > 1 ? 'product_group' : 'product',
          value: priceBreakdown.price / 100
        });
        handleGoNext();
      }
    }
  );

  if (activeStep === 0) {
    return (
      <ReviewClass klass={props.klass}>
        <Upsales
          klass={props.klass}
          bundleSize={klasses.length}
          priceBreakdown={priceBreakdown}
        />
        {props.klass.series && (
          <div style={{ marginBottom: 32 }}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Please check the box for additional units, should your schedule
              changes, we can reschedule for you easily.
            </Typography>
            {props.klass.series.map(cls => (
              <BundleOption
                key={cls.id}
                klass={cls}
                checked={klasses.indexOf(cls) >= 0}
                onChange={toggleAddon}
              />
            ))}
          </div>
        )}
        <ConfirmStudent
          klass={props.klass}
          user={props.user}
          selected={student}
          selectStudent={selectStudent}
          handleStudentConfirmed={handleGoNext}
          handleStudentAdded={student => {
            selectStudent(student);
            handleGoNext();
          }}
        />
      </ReviewClass>
    );
  }

  if (activeStep === 1) {
    return (
      <MakePurchase
        user={props.user}
        isEnrolling={enrollState.loading}
        handleEnrollment={paymentMethodNonce => {
          const traits = getUserTraits();
          enrollClass({
            variables: {
              classIds: klasses.map(k => k.id),
              promotionId: coupon?.id,
              studentId: student?.id,
              paymentMethodNonce,
              credit: priceBreakdown.usedCredit,
              source: traits.source,
              campaign: traits.campaign
            }
          });
        }}
      />
    );
  }

  return (
    <Container maxWidth="md">
      <PostEnrollmentShare course={props.klass.course} />
    </Container>
  );
}
