import { useLazyQuery } from '@apollo/react-hooks';
import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { Promotion, QueryArgs } from '../../../types';
import { DeeplinkContext } from '../../context/deeplink';
import { transformGraphqlError } from '../../graphql/apollo';
import { RedeemCouponQuery } from '../../graphql/enrollment-queries';
import { logEvent } from '../../lib/analytics';
import CLTextInput from '../text-input';

interface Props {
  courseId: string;
  bundleSize: number;
  setCoupon: (promotion: Promotion) => void;
}

export default function ApplyCoupon(props: Props) {
  const deeplink = React.useContext(DeeplinkContext);
  const [code, setCode] = React.useState(deeplink.coupon || '');
  const [errors, setErrors] = React.useState({});

  const [redeemCoupon, result] = useLazyQuery<
    { promotion: Promotion },
    QueryArgs.Promotion
  >(RedeemCouponQuery, {
    onCompleted(data) {
      if (!data || !data.promotion) {
        return props.setCoupon(null);
      }

      if (props.bundleSize > 1) {
        if (data.promotion.amountInPackage <= 0) {
          setErrors({
            code: 'This coupon can only be used to purchase a single unit'
          });
          return props.setCoupon(null);
        }
      } else if (data.promotion.amount <= 0) {
        setErrors({
          code: 'This coupon cannot be used to purchase a single unit '
        });
        return props.setCoupon(null);
      }

      props.setCoupon(data.promotion);
    },
    onError(err) {
      setErrors(transformGraphqlError(err).details);
      props.setCoupon(null);
    }
  });

  return (
    <form
      onSubmit={evt => {
        evt.preventDefault();
        logEvent('ApplyCoupon', {
          label: code
        });
        redeemCoupon({
          variables: {
            code,
            courseId: props.courseId
          }
        });
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs>
          <CLTextInput
            name="code"
            placeholder="Coupon code"
            value={code}
            errors={errors}
            fullWidth
            onChange={evt => {
              setCode(evt.target.value);
              setErrors({});
            }}
            margin="none"
            required
          />
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            size="small"
            color="primary"
            disabled={result.loading}
          >
            Redeem
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
