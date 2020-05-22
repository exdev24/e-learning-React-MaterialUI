export type PaymentFacade =
  | { isValid: false }
  | {
      isValid: true;
      tokenize: () => Promise<string>;
    };

export type PaymentProcessor = 'card' | 'paypal' | 'vault';
export enum PaymentProcessorEnum {
  'card' = 'card',
  'paypal' = 'paypal',
  'vault' = 'vault'
}

export interface CreditCardTokenizeOptions {
  vault?: boolean;
  cardholderName?: string;
  billingAddress?: any;
  smsCode?: string;
}

export type PaymentData =
  | { isValid: false }
  | {
      isValid: true;
      tokenize: (options: CreditCardTokenizeOptions) => Promise<string>;
    };

export interface PaymentFormParameters {
  hasCVVChallenge: boolean;
  hasPostalCodeChallenge: boolean;
  paypalEnabled: boolean;
}

interface VaultedPaymentDetailsPaypal {
  email: string;
}
interface VaultedPaymentDetailsCreditCard {
  cardType: string;
  lastFour: string;
}

interface VaultedPaymentBase {
  nonce: string;
  default: boolean;
}

export type VaultedPayment =
  | (VaultedPaymentBase & {
      type: 'PayPalAccount';
      details: VaultedPaymentDetailsPaypal;
    })
  | (VaultedPaymentBase & {
      type: 'CreditCard';
      details: VaultedPaymentDetailsCreditCard;
    });
