import {
  Client,
  client,
  HostedFieldFieldOptions,
  HostedFields,
  hostedFields,
  HostedFieldsStateObject,
  paypal,
  PayPal
} from 'braintree-web';
import vaultManager from 'braintree-web/vault-manager';
import React from 'react';
import {
  CreditCardTokenizeOptions,
  PaymentData,
  PaymentFormParameters,
  PaymentProcessor,
  VaultedPayment
} from '../../types/payment';

interface InitArgs {
  authorization: string;
  styles: { [key: string]: { [key: string]: string } };
  fields: HostedFieldFieldOptions;
  eventHandlers: EventHandlers;
}

interface EventHandlers {
  // when payment module is set up successfully
  onSetUpSuccess: (
    parameters: PaymentFormParameters,
    vaultedPayments: VaultedPayment[]
  ) => void;
  onFormValidityChange: (type: PaymentProcessor, payment: PaymentData) => void;
  onCardTypeChange: (cardType: string | null) => void;
  onError: (error: Error) => void;
  // when there's an API call in process or pop up window opened
  onProcessing: (isProcessing: boolean) => void;
}

export default class BraintreeClient {
  private readonly fields: HostedFieldFieldOptions;
  private readonly styles: React.CSSProperties;
  private readonly eventHandlers: EventHandlers;

  private hostedFields: HostedFields;
  private paypalInstance: PayPal;
  private vaultManagerInstance: any;

  constructor({ authorization, styles, fields, eventHandlers }: InitArgs) {
    this.styles = styles || {};
    this.fields = fields;
    this.eventHandlers = eventHandlers;
    this.setUp(authorization);
  }

  private async setUp(authorization: string) {
    try {
      const clientInstance = await client.create({ authorization });
      const paymentMethods = await this.setUpVaultManager(clientInstance);

      const config = clientInstance.getConfiguration().gatewayConfiguration;
      const paymentFormParameters = {
        hasCVVChallenge: config.challenges.indexOf('cvv') !== -1,
        hasPostalCodeChallenge: config.challenges.indexOf('postal_code') !== -1,
        paypalEnabled: config.paypalEnabled
      };

      await this.setUpCreditCards(clientInstance, paymentFormParameters);
      await this.setUpPayPal(clientInstance, paymentFormParameters);
      this.eventHandlers.onSetUpSuccess(paymentFormParameters, paymentMethods);
    } catch (err) {
      this.eventHandlers.onError(err);
    }
  }

  private async setUpVaultManager(client: Client) {
    this.vaultManagerInstance = await vaultManager.create({ client });
    return this.vaultManagerInstance.fetchPaymentMethods();
  }

  private async setUpPayPal(client: Client, params: PaymentFormParameters) {
    if (params.paypalEnabled) {
      this.paypalInstance = await paypal.create({ client });
    }
  }

  processPayPal = () => {
    this.eventHandlers.onProcessing(true);
    // this.paypalButton.current.setAttribute('disabled', 'true');

    // Because tokenization opens a popup, this has to be called as a result of
    // customer action, like clicking a button. You cannot call this at any time.
    this.paypalInstance
      .tokenize({
        flow: 'vault'
      })
      .then(payload => {
        this.eventHandlers.onFormValidityChange('paypal', {
          isValid: true,
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore: old @types library, it works with promises. Remove once it's updated
          tokenize: () => Promise.resolve(payload.nonce)
        });
      })
      .catch(tokenizeErr => {
        this.eventHandlers.onFormValidityChange('paypal', { isValid: false });
        // if closed, do nothing
        if (tokenizeErr.code !== 'PAYPAL_POPUP_CLOSED') {
          this.eventHandlers.onError(tokenizeErr);
        }
      })
      .finally(() => this.eventHandlers.onProcessing(false));
  };

  private async setUpCreditCards(client: Client, params: PaymentFormParameters) {
    const enabledFields = Object.assign({}, this.fields);
    if (!params.hasCVVChallenge) {
      delete enabledFields.cvv;
    }
    if (!params.hasPostalCodeChallenge) {
      delete enabledFields.postalCode;
    }

    this.hostedFields = await hostedFields.create({
      client,
      styles: this.styles,
      fields: enabledFields
    });

    this.hostedFields.on('validityChange', this.onValidityChange);
    this.hostedFields.on('cardTypeChange', this.onCardTypeChange);
  }

  onValidityChange = () => {
    const state = this.hostedFields.getState();

    const isValid = Object.keys(state.fields).every(
      key => state.fields[key].isValid
    );

    if (isValid) {
      this.eventHandlers.onFormValidityChange('card', {
        isValid: true,
        tokenize: this.tokenize
      });
    } else {
      this.eventHandlers.onFormValidityChange('card', {
        isValid: false
      });
    }
  };

  onCardTypeChange = (field: HostedFieldsStateObject) => {
    const cardType = field.cards.length > 0 ? field.cards[0].type : null;
    this.eventHandlers.onCardTypeChange(cardType);
  };

  teardown() {
    if (this.hostedFields) this.hostedFields.teardown();
    if (this.paypalInstance) this.paypalInstance.teardown();
    if (this.vaultManagerInstance) this.vaultManagerInstance.teardown();
  }

  tokenize = async (options: CreditCardTokenizeOptions = {}) => {
    try {
      const res = await this.hostedFields.tokenize(options);
      return res.nonce;
    } catch {
      throw new Error(
        'Payment was not accepted. Please try again or use a different payment method'
      );
    }
  };
}
