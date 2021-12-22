import { Alert } from '@material-ui/lab';
import React from 'react';
import { useTranslation } from '../../shared/i18n';
import { PaymentData } from '../../types/payment';
import { User } from '../graphql/data-models';
import BraintreeClient from '../lib/braintree-client';
import ClButton from './cl-button';
import { Icon, PaymentIcons } from './payment-icons';

interface Props {
  isProcessing: boolean;
  client?: BraintreeClient;
  payment: PaymentData;
  user: User;
  amount: string;
}

export default function PaymentModuleAlipay(props: Props) {
  const { t } = useTranslation('checkout');

  if (props.payment.isValid) {
    return <Alert color="success">{t('braintree.alipay.authorized')}</Alert>;
  }

  return (
    <>
      <ClButton
        loading={props.isProcessing}
        startIcon={
          <PaymentIcons
            style={{ height: 28, color: '#00a1e9' }}
            type={Icon.AliPay}
          />
        }
        variant="contained"
        size="large"
        onClick={e => {
          e.preventDefault();
          if (props.client) {
            props.client.processAliPay({
              paymentType: 'alipay',
              amount: props.amount,
              currencyCode: 'USD',
              shippingAddressRequired: false,
              givenName: props.user.firstName,
              surname: props.user.lastName,
              email: props.user.email,
              fallback: {
                buttonText: t('braintree.alipay.cta'),
                url: document.location.href
              }
            });
          }
        }}
      >
        {t('braintree.alipay.cta')}
      </ClButton>
      <Alert color="info" style={{ marginTop: 24 }}>
        {t('braintree.alipay.help')}
      </Alert>
    </>
  );
}
