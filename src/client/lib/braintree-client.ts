import {
  client,
  hostedFields,
  localPayment,
  paypal,
  vaultManager
} from 'braintree-web';
import { fontFamily } from '../../shared/constants';
import {
  GatewayConfig,
  HostedFieldOptions,
  LocalPaymentOptions,
  PaymentData,
  PaymentProcessor,
  VaultedPayment
} from '../../types/payment';

interface InitArgs {
  authorization: string;
  fields: HostedFieldOptions;
  eventHandlers: EventHandlers;
}

interface EventHandlers {
  // when payment module is set up successfully
  onSetUpSuccess: (cfg: GatewayConfig, vaultedPayments: VaultedPayment[]) => void;
  onFormValidityChange: (type: PaymentProcessor, payment: PaymentData) => void;
  onCardTypeChange: (cardType: string) => void;
  onError: (error: Error) => void;
  // when there's an API call in process or pop up window opened
  onProcessing: (isProcessing: boolean) => void;
}

export default class BraintreeClient {
  private readonly fields: HostedFieldOptions;
  private readonly eventHandlers: EventHandlers;

  private hostedFields: any;
  private paypalInstance: any;
  private vaultManagerInstance: any;
  private alipayInstance: any;

  constructor({ authorization, fields, eventHandlers }: InitArgs) {
    this.fields = fields;
    this.eventHandlers = eventHandlers;
    this.setUp(authorization).catch(eventHandlers.onError);
  }

  private async setUp(authorization: string) {
    const clientInstance = await client.create({ authorization });

    const cfg: GatewayConfig = clientInstance.getConfiguration()
      .gatewayConfiguration;

    this.vaultManagerInstance = await vaultManager.create({
      client: clientInstance
    });

    await this.setUpCreditCards(clientInstance, cfg);
    if (cfg.paypalEnabled) {
      this.paypalInstance = await paypal.create({ client: clientInstance });
      this.alipayInstance = await localPayment.create({
        client: clientInstance,
        merchantAccountId: cfg.paypal.merchantAccountId
      });
    }

    const paymentMethods = await this.vaultManagerInstance.fetchPaymentMethods();
    this.eventHandlers.onSetUpSuccess(cfg, paymentMethods);
  }

  processPayPal = async () => {
    this.eventHandlers.onProcessing(true);

    // Because tokenization opens a popup, this has to be called as a result of
    // customer action, like clicking a button. You cannot call this at any time.
    try {
      const payload = await this.paypalInstance.tokenize({ flow: 'vault' });
      this.eventHandlers.onProcessing(false);
      this.eventHandlers.onFormValidityChange('paypal', {
        isValid: true,
        tokenize: () => Promise.resolve(payload.nonce)
      });
    } catch (err) {
      this.eventHandlers.onFormValidityChange('paypal', { isValid: false });
      this.eventHandlers.onProcessing(false);
      // if closed, do nothing
      if (err.code !== 'PAYPAL_POPUP_CLOSED') {
        this.eventHandlers.onError(err);
      }
    }
  };

  processAliPay = async (options: LocalPaymentOptions) => {
    this.eventHandlers.onProcessing(true);

    try {
      const payload = await this.alipayInstance.startPayment({
        ...options,
        onPaymentStart(_, start) {
          start();
        }
      });

      this.eventHandlers.onProcessing(false);
      this.eventHandlers.onFormValidityChange('alipay', {
        isValid: true,
        tokenize: () => Promise.resolve(payload.nonce)
      });
    } catch (err) {
      this.eventHandlers.onFormValidityChange('alipay', { isValid: false });
      this.eventHandlers.onProcessing(false);
      // if closed, do nothing
      if (err.code !== 'LOCAL_PAYMENT_POPUP_CLOSED') {
        this.eventHandlers.onError(err);
      }
    }
  };

  private async setUpCreditCards(client: any, cfg: GatewayConfig) {
    const enabledFields: {
      [key: string]: { container: string; placeholder: string };
    } = {};

    for (const name of Object.keys(this.fields)) {
      const option = this.fields[name];
      if (option.challenge && cfg.challenges.indexOf(option.challenge) < 0) {
        continue;
      }

      enabledFields[name] = {
        placeholder: option.placeholder,
        container: '#' + option.id
      };
    }

    this.hostedFields = await hostedFields.create({
      client,
      fields: enabledFields,
      styles: {
        input: {
          'font-size': '16px',
          'font-weight': 400,
          'font-family': fontFamily
        },
        '.invalid': {
          color: 'rgb(244, 67, 54)'
        }
      }
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
        tokenize: options =>
          this.hostedFields.tokenize(options).then(result => result.nonce)
      });
    } else {
      this.eventHandlers.onFormValidityChange('card', {
        isValid: false
      });
    }
  };

  onCardTypeChange = field => {
    const cardType = field.cards.length > 0 ? field.cards[0].type : '';
    this.eventHandlers.onCardTypeChange(cardType);
  };

  teardown() {
    if (this.hostedFields) this.hostedFields.teardown();
    if (this.paypalInstance) this.paypalInstance.teardown();
    if (this.vaultManagerInstance) this.vaultManagerInstance.teardown();
    if (this.alipayInstance) this.alipayInstance.teardown();
  }
}
