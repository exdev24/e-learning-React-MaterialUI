import { Grid, InputAdornment, TextField } from '@material-ui/core';
import {
  AccountCircle,
  CreditCard,
  DateRange,
  LocationOn,
  Lock
} from '@material-ui/icons';
import React from 'react';
import { HostedFieldOptions } from '../../types/payment';
import HostedField from './hosted-field';
import { PaymentIcons } from './payment-icons';

interface Props {
  cardholderName: string;
  onCardholderNameChange: (value: string) => void;
  cardType: string | null;
  cvvEnabled: boolean;
  postalCodeEnabled: boolean;
}

export const hostedFieldOptions: HostedFieldOptions = {
  number: {
    id: 'card-number',
    placeholder: '1111 1111 1111 1111',
    label: 'Card Number'
  },
  cvv: {
    id: 'cvv',
    placeholder: '•••',
    label: 'CVV',
    challenge: 'cvv'
  },
  expirationDate: {
    id: 'expiration-date',
    placeholder: 'MM / YY',
    label: 'Expiration'
  },
  postalCode: {
    id: 'postal-code',
    placeholder: '11111',
    label: 'Zip Code',
    challenge: 'postal_code'
  }
};

export function PaymentModuleCreditCard({
  cardholderName,
  onCardholderNameChange,
  cardType,
  cvvEnabled,
  postalCodeEnabled
}: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs>
          <HostedField {...hostedFieldOptions.number} Icon={CreditCard} />
        </Grid>
        {cardType && (
          <Grid item xs="auto">
            <PaymentIcons
              style={{ height: 24 }}
              type={cardType.replace('-', '').toLowerCase()}
            />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            placeholder="your name"
            label="Cardholder name"
            value={cardholderName}
            onChange={evt => onCardholderNameChange(evt.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={cvvEnabled ? 6 : 12}>
          <HostedField {...hostedFieldOptions.expirationDate} Icon={DateRange} />
        </Grid>
        {cvvEnabled && (
          <Grid item xs={12} sm={6}>
            <HostedField {...hostedFieldOptions.cvv} Icon={Lock} />
          </Grid>
        )}

        {postalCodeEnabled && (
          <Grid item xs={12}>
            <HostedField {...hostedFieldOptions.postalCode} Icon={LocationOn} />
          </Grid>
        )}
      </Grid>
    </div>
  );
}
