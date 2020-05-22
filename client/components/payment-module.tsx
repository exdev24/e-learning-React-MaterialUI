import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Tab,
  Tabs
} from '@material-ui/core';
import React from 'react';
import { AlertManager, withAlert } from 'react-alert';
import {
  PaymentData,
  PaymentFacade,
  PaymentFormParameters,
  PaymentProcessor,
  PaymentProcessorEnum,
  VaultedPayment
} from '../../types/payment';
import { User } from '../graphql/data-models';
import BraintreeClient from '../lib/braintree-client';
import { PaymentModuleCreditCard } from './payment-module-credit-card';
import { PaymentModulePaypal } from './payment-module-paypal';
import { PaymentVault } from './payment-vault';
import TabPanel from './tab-panel';

interface Props {
  alert: AlertManager;
  user: User;
  onFormValidityChange?: (payment: PaymentFacade) => void;
}

interface State {
  cardType: string | null;
  isProcessing: boolean;
  isFormReady: boolean;
  cardholderName: string;
  savePaymentToVault: boolean;
  vaultedPayments: VaultedPayment[];
  vaultedSelectedToken: string | null;
  payments: { [key in PaymentProcessor]: PaymentData };
  tab: PaymentProcessor;
  paymentFormParameters: PaymentFormParameters;
}

class PaymentModule extends React.Component<Props, State> {
  state: State = {
    // need to initially enable everything, to let the braintree initialize correctly
    paymentFormParameters: {
      hasCVVChallenge: true,
      hasPostalCodeChallenge: true,
      paypalEnabled: true
    },
    cardType: null,
    isProcessing: false,
    isFormReady: false,
    cardholderName: '',
    savePaymentToVault: true,
    vaultedPayments: [],
    vaultedSelectedToken: null,
    payments: {
      vault: { isValid: false },
      card: { isValid: false },
      paypal: { isValid: false }
    },
    tab: PaymentProcessorEnum.card
  };

  container = React.createRef<HTMLDivElement>();

  client?: BraintreeClient;

  cardholderNameIsValid = () => {
    return this.state.cardholderName.length >= 2;
  };

  onCCValidityChange = () => {
    // Need to postpone tokenize until form is submitted,
    // because can't tokenize on every time user types in cardholder name field
    const { cardholderName, savePaymentToVault } = this.state;
    const payment = this.getPaymentForCurrentTab();
    if (payment.isValid && this.cardholderNameIsValid()) {
      this.props.onFormValidityChange({
        isValid: true,
        tokenize: () =>
          payment.tokenize({ cardholderName, vault: savePaymentToVault })
      });
    } else {
      this.props.onFormValidityChange({ isValid: false });
    }
  };

  getPaymentForCurrentTab() {
    const { payments, tab } = this.state;
    return payments[tab];
  }

  onDefaultValidityChange() {
    const payment = this.getPaymentForCurrentTab();
    if (payment.isValid) {
      this.props.onFormValidityChange({
        isValid: true,
        tokenize: () => payment.tokenize({})
      });
    } else {
      this.props.onFormValidityChange({
        isValid: false
      });
    }
  }

  onVaultSelectionChange = (token: string) => {
    const { payments } = this.state;
    this.setState(
      {
        vaultedSelectedToken: token,
        payments: {
          ...payments,
          [PaymentProcessorEnum.vault]: {
            isValid: true,
            tokenize: () => Promise.resolve(token)
          }
        }
      },
      this.handleFormValidityChange
    );
  };

  handleFormValidityChange = () => {
    const { tab } = this.state;
    if (tab === PaymentProcessorEnum.card) {
      this.onCCValidityChange();
    } else {
      this.onDefaultValidityChange();
    }
  };

  async componentDidMount() {
    this.client = new BraintreeClient({
      authorization: this.props.user.braintreeToken,
      eventHandlers: {
        onSetUpSuccess: (paymentFormParameters, vaultedPayments) => {
          this.setState(
            {
              isFormReady: true,
              tab: vaultedPayments.length
                ? PaymentProcessorEnum.vault
                : PaymentProcessorEnum.card,
              paymentFormParameters,
              vaultedPayments
            },
            () => {
              if (vaultedPayments.length) {
                this.onVaultSelectionChange(vaultedPayments[0].nonce);
              }
            }
          );
        },
        onFormValidityChange: (type, payment) => {
          const { payments } = this.state;
          this.setState(
            {
              payments: { ...payments, [type]: payment }
            },
            this.handleFormValidityChange
          );
        },
        onCardTypeChange: cardType => this.setState({ cardType }),
        onError: error => this.props.alert.error(error.message),
        onProcessing: isProcessing => this.setState({ isProcessing })
      },
      styles: {
        input: {
          'font-size': '16px'
        },
        ':focus': {
          color: 'blue'
        },
        '.valid': {
          color: 'green'
        },
        '.invalid': {
          color: 'red'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '1111 1111 1111 1111'
        },
        cvv: {
          selector: '#cvv',
          placeholder: '111'
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: 'MM/YY'
        },
        postalCode: {
          selector: '#postal-code',
          placeholder: '11111'
        }
      }
    });
  }

  async componentWillUnmount() {
    if (this.client) {
      this.client.teardown();
    }
  }

  onTabSwitch = (newTab: PaymentProcessor) => {
    this.setState({ tab: newTab }, this.handleFormValidityChange);
  };

  render() {
    const {
      tab,
      payments,
      paymentFormParameters,
      vaultedPayments,
      vaultedSelectedToken,
      savePaymentToVault
    } = this.state;
    const payment = payments[tab];

    return (
      <Box p={3} boxShadow={1}>
        {!this.state.isFormReady && <CircularProgress />}
        {/* need to have the elements in DOM to set up braintree,
        but should not make them visible because they're not styled
        until it's finished initializing */}
        <div style={{ display: this.state.isFormReady ? 'block' : 'none' }}>
          <div style={{ marginBottom: 30 }}>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, newTab) => this.onTabSwitch(newTab)}
            >
              {vaultedPayments.length > 0 && (
                <Tab value={PaymentProcessorEnum.vault} label="Saved" />
              )}
              <Tab value={PaymentProcessorEnum.card} label="Credit / Debit Card" />
              {paymentFormParameters.paypalEnabled && (
                <Tab value={PaymentProcessorEnum.paypal} label="Paypal" />
              )}
            </Tabs>
          </div>
          {vaultedPayments.length > 0 && (
            <TabPanel openTab={tab} tabName={PaymentProcessorEnum.vault}>
              <PaymentVault
                selectedToken={vaultedSelectedToken}
                vaultedPayments={vaultedPayments}
                onChange={this.onVaultSelectionChange}
              />
            </TabPanel>
          )}
          <TabPanel openTab={tab} tabName={PaymentProcessorEnum.card}>
            <PaymentModuleCreditCard
              showCardholderNameError={
                !this.cardholderNameIsValid() && this.state.cardholderName !== ''
              }
              cvvEnabled={paymentFormParameters.hasCVVChallenge}
              postalCodeEnabled={paymentFormParameters.hasPostalCodeChallenge}
              cardType={this.state.cardType}
              onCardholderNameChange={cardholderName => {
                this.setState({ cardholderName }, this.onCCValidityChange);
              }}
            />
          </TabPanel>
          {paymentFormParameters.paypalEnabled && (
            <TabPanel openTab={tab} tabName={PaymentProcessorEnum.paypal}>
              <PaymentModulePaypal
                isProcessing={this.state.isProcessing}
                onProcessPayPal={this.client && this.client.processPayPal}
                payment={payment}
              />
            </TabPanel>
          )}
          {tab !== PaymentProcessorEnum.vault && (
            <FormControlLabel
              checked={savePaymentToVault}
              control={<Checkbox />}
              onChange={(e, checked) =>
                this.setState({ savePaymentToVault: checked })
              }
              label="Save payment method"
            />
          )}
        </div>
      </Box>
    );
  }
}

export default withAlert<Props>()(PaymentModule);
