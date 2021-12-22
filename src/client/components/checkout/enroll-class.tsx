import { useMutation } from '@apollo/react-hooks';
import { Container, Typography } from '@material-ui/core';
import React from 'react';
import { getPriceBreakdown } from '../../../shared/pricing';
import { MutationArgs } from '../../../types';
import { CheckoutContext } from '../../context/checkout';
import {
  EnrollClassMutation,
  GetUserWithClassResponse
} from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
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
    handleError,
    handleGoNext,
    toggleAddon,
    source,
    campaign
  } = React.useContext(CheckoutContext);

  const priceBreakdown = getPriceBreakdown(klasses, {
    balanceInCents: props.user.balanceInCents,
    promotion: coupon,
    wholePackage: false
  });

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

  if (activeStep === 0 || !student) {
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
                student={student}
                onChange={toggleAddon}
              />
            ))}
          </div>
        )}
        <ConfirmStudent
          klass={props.klass}
          user={props.user}
          onConfirmed={handleGoNext}
        />
      </ReviewClass>
    );
  }

  if (activeStep === 1) {
    return (
      <MakePurchase
        user={props.user}
        isEnrolling={enrollState.loading}
        priceBreakdown={priceBreakdown}
        handleEnrollment={paymentMethodNonce =>
          enrollClass({
            variables: {
              classIds: klasses.map(k => k.id),
              promotionId: coupon?.id,
              studentId: student.id,
              credit: priceBreakdown.usedCredit,
              paymentMethodNonce,
              source,
              campaign
            }
          })
        }
      />
    );
  }

  return (
    <Container maxWidth="md">
      <PostEnrollmentShare course={props.klass.course} />
    </Container>
  );
}
