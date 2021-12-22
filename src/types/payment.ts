type Invalid = { isValid: false };

export type PaymentFacade =
  | Invalid
  | {
      isValid: true;
      tokenize: () => Promise<string>;
    };

export type PaymentData =
  | Invalid
  | {
      isValid: true;
      tokenize: (options: CreditCardTokenizeOptions) => Promise<string>;
    };

export type PaymentProcessor = 'card' | 'paypal' | 'vault' | 'alipay';

export interface CreditCardTokenizeOptions {
  vault?: boolean;
  cardholderName?: string;
  billingAddress?: any;
  smsCode?: string;
}

export interface GatewayConfig {
  challenges: string[];
  environment: 'sandbox' | 'production';
  merchantId: string;
  paypal: { displayName: string; clientId: string; merchantAccountId: string };
  paypalEnabled: boolean;
}

export interface HostedFieldOption {
  id: string;
  label: string;
  placeholder: string;
  challenge?: string;
}

export interface HostedFieldOptions {
  number: HostedFieldOption;
  expirationDate?: HostedFieldOption;
  expirationMonth?: HostedFieldOption;
  expirationYear?: HostedFieldOption;
  cvv: HostedFieldOption;
  postalCode?: HostedFieldOption;
}

export interface LocalPaymentOptions {
  fallback: {
    buttonText: string;
    url: string;
  };
  amount: string;
  paymentType: 'alipay';
  currencyCode: 'EUR' | 'USD' | 'GBP' | 'AUD' | 'HKD' | 'SGD';
  shippingAddressRequired: boolean;
  givenName: string;
  surname: string;
  email: string;
}

interface VaultedPaymentBase {
  nonce: string;
  default: boolean;
}

interface VaultedPaymentDetailsPaypal extends VaultedPaymentBase {
  type: 'PayPalAccount';
  details: { email: string };
}

interface VaultedPaymentDetailsCreditCard extends VaultedPaymentBase {
  type: 'CreditCard';
  details: {
    cardType: string;
    lastFour: string;
  };
}

export type VaultedPayment =
  | VaultedPaymentDetailsPaypal
  | VaultedPaymentDetailsCreditCard;
