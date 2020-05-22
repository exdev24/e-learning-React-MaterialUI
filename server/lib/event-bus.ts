import {
  AccountCreatedEvent,
  AccountUpdatedEvent,
  ClassEnrolledEvent,
  RedeemCouponEvent
} from 'common';
import { EnrollmentModel, UserModel } from 'models';
import config from 'config';
import { cloudWatchEvents } from './aws';
import logger from './logger';

interface WebEvent {
  type: string;
  payload: Record<string, any>;
}

export function sendEvents(events: WebEvent[]) {
  return cloudWatchEvents
    .putEvents({
      Entries: events.map(evt => ({
        DetailType: evt.type,
        Detail: JSON.stringify(evt.payload),
        Source: config.get('aws.topic')
      }))
    })
    .promise()
    .catch(err => logger.error(err));
}

export function emitSignupEvent(user: UserModel) {
  const event: AccountCreatedEvent = {
    type: 'ACCOUNT_CREATED',
    payload: {
      id: user.id,
      email: user.email
    }
  };

  return sendEvents([event]);
}

export function emitExpressSignupEvent(user: UserModel, record: EnrollmentModel) {
  const events: [AccountCreatedEvent, ClassEnrolledEvent] = [
    {
      type: 'ACCOUNT_CREATED',
      payload: {
        id: user.id,
        email: user.email
      }
    },
    {
      type: 'CLASS_ENROLLED',
      payload: {
        id: record.id,
        classId: record.classId
      }
    }
  ];

  return sendEvents(events);
}

export function emitRescheduleEvent(record: EnrollmentModel) {
  const event: ClassEnrolledEvent = {
    type: 'CLASS_ENROLLED',
    payload: {
      id: record.id,
      classId: record.classId,
      isReschedule: true
    }
  };

  return sendEvents([event]);
}

export function emitEnrollClassEvent(records: EnrollmentModel[]) {
  const events: ClassEnrolledEvent[] = records.map(record => ({
    type: 'CLASS_ENROLLED',
    payload: {
      id: record.id,
      classId: record.classId
    }
  }));

  return sendEvents(events);
}

export function emitAccountUpdated(userId: string) {
  const evt: AccountUpdatedEvent = {
    type: 'ACCOUNT_UPDATED',
    payload: {
      id: userId
    }
  };

  return sendEvents([evt]);
}

export function emitRedeemCoupon(payload: RedeemCouponEvent['payload']) {
  return sendEvents([
    {
      type: 'REDEEM_COUPON',
      payload
    }
  ]);
}
