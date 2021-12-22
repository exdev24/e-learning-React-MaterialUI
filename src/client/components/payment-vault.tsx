import { FormControlLabel, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';
import { VaultedPayment } from '../../types/payment';
import { Icon, PaymentIcons } from './payment-icons';

interface Props {
  vaultedPayments: VaultedPayment[];
  onChange: (token: string) => void;
  selectedToken: string | null;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    paddingRight: 6,
    '&>svg': {
      height: 24,
      border: '1px solid #BBBBBB',
      borderRadius: theme.shape.borderRadius,
      display: 'block'
    }
  },
  label: {
    fontWeight: theme.typography.fontWeightMedium,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 202
    }
  }
}));

export const PaymentVault = ({
  vaultedPayments,
  onChange,
  selectedToken
}: Props) => {
  const classes = useStyles({});

  function getImage(paymentType: string) {
    const handle = paymentType.replace(' ', '').toLowerCase();
    return <PaymentIcons type={handle} />;
  }

  function renderLabel(payment: VaultedPayment) {
    if (payment.type == 'CreditCard') {
      return (
        <div className={classes.wrapper}>
          <div className={classes.logo}>{getImage(payment.details.cardType)}</div>
          <div className={classes.label}>Ending in {payment.details.lastFour}</div>
        </div>
      );
    }
    if (payment.type == 'PayPalAccount') {
      return (
        <div className={classes.wrapper}>
          <div className={classes.logo}>{getImage(Icon.PayPal)}</div>
          <div className={classes.label}>{payment.details.email}</div>
        </div>
      );
    }
  }

  return (
    <div>
      <RadioGroup value={selectedToken} onChange={e => onChange(e.target.value)}>
        {vaultedPayments.map(payment => (
          <FormControlLabel
            key={payment.nonce}
            value={payment.nonce}
            control={<Radio />}
            label={renderLabel(payment)}
          />
        ))}
      </RadioGroup>
    </div>
  );
};
