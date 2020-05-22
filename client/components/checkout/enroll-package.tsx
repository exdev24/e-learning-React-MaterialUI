import { useMutation } from '@apollo/react-hooks';
import { Box, Container, Grid, List } from '@material-ui/core';
import { EventNoteRounded, InfoRounded, PaymentRounded } from '@material-ui/icons';
import React from 'react';
import { formatCents } from '../../../shared/pricing';
import { MutationArgs } from '../../../types';
import { CheckoutContext } from '../../context/checkout';
import {
  EnrollClassMutation,
  GetUserWithClassResponse
} from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
import { getUserTraits } from '../../lib/user-source';
import ClassInfoSchedules from '../class-info/class-info-schedules';
import InfoListItem from '../class-info/info-list-item';
import HorizontalDivider from '../horizontal-divider';
import PostEnrollmentShare from '../post-enrollment-share';
import PreflightCheck from '../preflight-check';
import ConfirmStudent from './confirm-student';
import MakePurchase from './make-purchase';
import Upsales from './upsales';

export default function EnrollCourse(props: GetUserWithClassResponse) {
  const {
    activeStep,
    coupon,
    klasses,
    priceBreakdown,
    student,
    handleError,
    handleGoNext,
    selectStudent
  } = React.useContext(CheckoutContext);

  const [enrollClass, enrollState] = useMutation<any, MutationArgs.EnrollClass>(
    EnrollClassMutation,
    {
      onError: handleError,
      onCompleted() {
        logEvent('Purchase', {
          content_name: props.klass.course.name,
          content_ids: klasses.map(kls => kls.courseId),
          content_type: 'product_group',
          value: priceBreakdown.price / 100
        });
        handleGoNext();
      }
    }
  );

  if (props.klass.course.level !== 1 || klasses.length < 2) {
    return <PreflightCheck statusCode={404} />;
  }

  if (activeStep === 0) {
    return (
      <Box padding={4} boxShadow={2}>
        <Grid container spacing={3}>
          <Grid item sm={4}>
            <img src={props.klass.course.thumbnail} alt={props.klass.course.name} />
          </Grid>
          <Grid item sm={8}>
            <List disablePadding dense>
              {coupon ? (
                <InfoListItem
                  Icon={PaymentRounded}
                  primary={formatCents(priceBreakdown.listingPrice)}
                />
              ) : (
                <InfoListItem
                  Icon={PaymentRounded}
                  primary={formatCents(priceBreakdown.price)}
                  secondary={<del>{formatCents(priceBreakdown.listingPrice)}</del>}
                />
              )}

              {klasses.map(k => (
                <InfoListItem
                  key={k.id}
                  Icon={EventNoteRounded}
                  primary={k.course.name}
                  secondary={<ClassInfoSchedules schedules={k.schedules} />}
                />
              ))}

              {props.klass.course.info && (
                <InfoListItem Icon={InfoRounded} primary={props.klass.course.info} />
              )}
            </List>
          </Grid>
        </Grid>
        <HorizontalDivider />
        <Upsales
          klass={props.klass}
          priceBreakdown={priceBreakdown}
          bundleSize={klasses.length}
        />
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
      </Box>
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
              wholePackage: true,
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
