import React from 'react';
import { Button } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { PaymentData } from '../../types/payment';

interface Props {
  isProcessing: boolean;
  onProcessPayPal: () => void;
  payment: PaymentData;
}

export const PaymentModulePaypal = (props: Props) => {
  return (
    <div>
      <Button
        onClick={e => {
          e.preventDefault();
          props.onProcessPayPal();
        }}
        disabled={props.isProcessing}
        style={{
          backgroundImage: 'url("/images/pay-with-paypal.png")',
          backgroundSize: 'cover',
          width: 110,
          height: 42,
          marginBottom: 15
        }}
      >
        {''}
      </Button>
      {props.payment.isValid && (
        <>
          <div>
            <Check />
            You`re paying with paypal
          </div>
        </>
      )}
    </div>
  );
};
