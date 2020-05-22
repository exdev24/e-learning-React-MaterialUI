import Boom from 'boom';
import { UserModel } from 'models';
import currency from 'currency.js';
import logger from '../lib/logger';
import gateway from './gateway';

const wellkowns = {
  '2046':
    'Transaction is declined, you will need to contact your issuing bank or PayPal for more details.',
  '2069': 'Payment declined by PayPal due to duplicate transactions.',
  '2074':
    'The payment method associated with this PayPal account was declined. You can try contacting issuing bank or try a different payment method.'
};

export async function generateClientToken(user: UserModel) {
  if (!user.braintreeCustomerId) {
    const result = await gateway.customer.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });

    if (!result.success) {
      logger.error(result, result.message);
      throw Boom.badRequest(result.message, result.errors.deepErrors());
    }

    await user.setDetails({
      braintreeCustomerId: result.customer.id
    });
  }

  const result = await gateway.clientToken.generate({
    customerId: user.details.braintreeCustomerId
  });

  if (!result.success) {
    logger.error(result, result.message);
    throw Boom.badRequest(result.message, result.errors.deepErrors());
  }

  return result.clientToken;
}

export async function sale(
  amount: number,
  paymentMethodNonce: string,
  orderId: string
) {
  const result = await gateway.transaction.sale({
    amount: currency(amount).format(),
    paymentMethodNonce,
    orderId,
    options: {
      submitForSettlement: true
    }
  });

  if (!result.success) {
    logger.info(
      result,
      'transaction rejected for %s',
      result.transaction && result.transaction.additionalProcessorResponse
    );

    let errMessage = result.message;
    if (result.transaction) {
      errMessage = wellkowns[result.transaction.processorResponseCode] || errMessage;
    }

    throw Boom.badRequest(errMessage, result.errors.deepErrors());
  }

  return result.transaction;
}

export async function refund(transactionId: string) {
  const result = await gateway.transaction.refund(transactionId);

  if (result.transaction) {
    return result.transaction;
  }

  logger.info(result, 'refund failed');
  throw Boom.badRequest(result.message, result.errors.deepErrors());
}
