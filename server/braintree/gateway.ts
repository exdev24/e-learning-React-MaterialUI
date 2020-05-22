import { BraintreeGateway, Environment } from 'braintree';
import config from 'config';

export default new BraintreeGateway({
  environment: Environment[config.get('braintree.environment')],
  merchantId: config.get('braintree.merchantId'),
  publicKey: config.get('braintree.publicKey'),
  privateKey: config.get('braintree.privateKey')
});
