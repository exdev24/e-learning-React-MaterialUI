import { Box, Button, Grid, Typography } from '@material-ui/core';
import { captureException, withScope } from '@sentry/browser';
import React from 'react';
import {
  describeCoupon,
  formatCents,
  PriceBreakdown,
  savingPercentageInPackage
} from '../../../shared/pricing';
import { PaymentFacade } from '../../../types/payment';
import { CheckoutContext } from '../../context/checkout';
import { ClassWithCourse } from '../../graphql/data-models';
import { GetUserWithClassResponse } from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
import CLButton from '../cl-button';
import HorizontalDivider from '../horizontal-divider';
import PaymentModule from '../payment-module';
import ApplyCoupon from './apply-coupon';

interface Props {
  isEnrolling: boolean;
  handleEnrollment: (paymentMethodNonce: string) => void;
  user: GetUserWithClassResponse['user'];
  priceBreakdown: PriceBreakdown;
}

interface State {
  payment: PaymentFacade;
}

export default class MakePurchase extends React.PureComponent<Props, State> {
  static contextType = CheckoutContext;

  context: React.ContextType<typeof CheckoutContext>;
  state: State = { payment: { isValid: false } };

  componentWillUnmount() {
    this.context.resetCoupon();
  }

  onFormValidityChange = (payment: PaymentFacade) => {
    this.setState({
      payment
    });
  };

  onError = (err: Error) => {
    if (err['type'] !== 'CUSTOMER') {
      // ignore user input error
      withScope(scope => {
        scope.setUser({ id: this.props.user.id });
        scope.setExtras(this.props.priceBreakdown);
        captureException(err);
      });
    }

    logEvent(err.name, {
      label: err.message,
      variant: err['type'],
      content_ids: this.context.klasses.map(k => k.id)
    });

    this.context.handleError(
      'Payment denied, please verify your information and try again.'
    );
  };

  onClickSubmit = async () => {
    let nonce = '';

    if (this.props.priceBreakdown.price === 0) {
      return this.props.handleEnrollment('');
    }

    if (this.state.payment.isValid) {
      try {
        nonce = await this.state.payment.tokenize();
      } catch (err) {
        this.onError(err);
      }
    }

    if (nonce) {
      this.props.handleEnrollment(nonce);
    }
  };

  renderProduct(klass: ClassWithCourse) {
    return (
      <Grid key={klass.id} container spacing={2}>
        <Grid item xs>
          {klass.course.name}
        </Grid>
        <Grid item>${klass.course.price}</Grid>
      </Grid>
    );
  }

  render() {
    const { payment } = this.state;
    const { handleGoBack, coupon, setCoupon, klasses } = this.context;
    const { user, isEnrolling, priceBreakdown } = this.props;

    const canEnroll = priceBreakdown.price === 0 || payment.isValid;

    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <PaymentModule
              user={user}
              price={priceBreakdown.price}
              onFormValidityChange={this.onFormValidityChange}
              onError={this.onError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ApplyCoupon
              courseId={klasses[0].courseId}
              bundleSize={klasses.length}
              setCoupon={setCoupon}
            />
            <Box p={3} mt={3} boxShadow={1}>
              {klasses.map(this.renderProduct, this)}
              {priceBreakdown.courseDiscount > 0 && (
                <Grid container spacing={2}>
                  <Grid item xs>
                    Learning by Course
                    <Typography
                      display="block"
                      variant="caption"
                      color="textSecondary"
                    >
                      {savingPercentageInPackage}% Off
                    </Typography>
                  </Grid>
                  <Grid item>{formatCents(-priceBreakdown.courseDiscount)}</Grid>
                </Grid>
              )}
              {priceBreakdown.promoDiscount > 0 && (
                <Grid container spacing={2}>
                  <Grid item xs>
                    Coupon
                    <Typography
                      display="block"
                      variant="caption"
                      color="textSecondary"
                    >
                      {describeCoupon(coupon, klasses.length)}
                    </Typography>
                  </Grid>
                  <Grid item>{formatCents(-priceBreakdown.promoDiscount)}</Grid>
                </Grid>
              )}
              {priceBreakdown.usedCredit > 0 && (
                <Grid container spacing={2}>
                  <Grid item xs>
                    Credits
                    <Typography
                      display="block"
                      variant="caption"
                      color="textSecondary"
                    >
                      Total balance {formatCents(user.balanceInCents)}
                    </Typography>
                  </Grid>
                  <Grid item>{formatCents(-priceBreakdown.usedCredit)}</Grid>
                </Grid>
              )}
              <HorizontalDivider />
              <Grid container spacing={2}>
                <Grid item xs>
                  Total (USD)
                </Grid>
                <Grid item>{formatCents(priceBreakdown.price)}</Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button className="enroll_back" onClick={handleGoBack}>
            Back
          </Button>
          <CLButton
            type="button"
            color="primary"
            variant="contained"
            loading={isEnrolling}
            disabled={!canEnroll}
            className="enroll_next"
            onClick={this.onClickSubmit}
          >
            Next
          </CLButton>
        </Box>
      </React.Fragment>
    );
  }
}
