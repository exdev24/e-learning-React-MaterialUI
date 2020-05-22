import React from 'react';
import { Grid, InputAdornment, TextField } from '@material-ui/core';
import HostedField from './hosted-field';
import {
  AccountCircle,
  CreditCard,
  DateRange,
  LocationOn,
  Lock
} from '@material-ui/icons';
import { PaymentIcons } from './payment-icons';

interface Props {
  onCardholderNameChange: (value: string) => void;
  showCardholderNameError: boolean;
  cardType: string | null;
  cvvEnabled: boolean;
  postalCodeEnabled: boolean;
}

export const PaymentModuleCreditCard = ({
  onCardholderNameChange,
  cardType,
  cvvEnabled,
  postalCodeEnabled,
  showCardholderNameError
}: Props) => {
  return (
    <>
      <Grid container spacing={2} alignItems="flex-end" style={{ marginBottom: 16 }}>
        <Grid item xs>
          <HostedField id="card-number" label="Card Number" Icon={CreditCard} />
        </Grid>
        {cardType && (
          <Grid item xs="auto">
            <PaymentIcons
              style={{
                height: 30,
                display: 'block'
              }}
              type={cardType.replace('-', '').toLowerCase()}
            />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={cvvEnabled ? 6 : 12}>
          <HostedField
            id="expiration-date"
            label="Expiration Date"
            Icon={DateRange}
          />
        </Grid>
        {cvvEnabled && (
          <Grid item xs={12} sm={6}>
            <HostedField id="cvv" label="CVV" Icon={Lock} />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            placeholder="Enter name"
            label="Cardholder name"
            id="cardholder-name"
            error={showCardholderNameError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              )
            }}
            onChange={e => onCardholderNameChange(e.target.value)}
          />
        </Grid>
        {postalCodeEnabled && (
          <Grid item xs={12}>
            <HostedField id="postal-code" label="Postal Code" Icon={LocationOn} />
          </Grid>
        )}
      </Grid>
    </>
  );
};
