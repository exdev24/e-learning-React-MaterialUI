import { UserModel } from 'cl-models';
import gateway from './gateway';
import { GraphqlContext } from '../graphql';

const wellkowns = {
  '2046':
    'Transaction is declined, you will need to contact your issuing bank or PayPal for more details.',
  '2069': 'Payment declined by PayPal due to duplicate transactions.',
  '2074':
    'The payment method associated with this PayPal account was declined. You can try contacting issuing bank or try a different payment method.'
};

export async function generateClientToken(user: UserModel, ctx: GraphqlContext) {
  if (!user.braintreeCustomerId) {
    const result = await gateway.customer.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });

    if (!result.success) {
      ctx.logger.error(result, result.message);
      ctx.badRequest(result.message, result.errors.deepErrors());
    }

    await user.setDetails({
      braintreeCustomerId: result.customer.id
    });
  }

  const result = await gateway.clientToken.generate({
    customerId: user.details.braintreeCustomerId
  });

  if (!result.success) {
    ctx.logger.error(result, result.message);
    ctx.badRequest(result.message, result.errors.deepErrors());
  }

  return result.clientToken;
}

export async function sale(
  cents: number,
  paymentMethodNonce: string,
  orderId: string,
  ctx: GraphqlContext
) {
  const result = await gateway.transaction.sale({
    amount: '' + cents / 100,
    paymentMethodNonce,
    orderId,
    options: {
      submitForSettlement: true
    }
  });

  if (!result.success) {
    ctx.logger.error(
      result,
      'transaction rejected for %s',
      result.transaction && result.transaction.additionalProccessorResponse
    );

    let errMessage = result.message;
    if (result.transaction) {
      errMessage = wellkowns[result.transaction.processorResponseCode] || errMessage;
    }

    ctx.badRequest(errMessage, result.errors.deepErrors());
  }

  return result.transaction;
}
