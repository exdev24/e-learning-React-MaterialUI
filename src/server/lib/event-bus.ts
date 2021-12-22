import { EnrollmentModel, UserModel } from 'cl-models';
import { cloudWatchEvents, cloudWatchTopic } from './aws';
import logger from './logger';

interface WebEvent {
  type: string;
  payload: Record<string, any>;
}

interface AccountCreatedEvent {
  type: 'ACCOUNT_CREATED';
  payload: { id: string; email: string };
}

interface ClassEnrolledEvent {
  type: 'CLASS_ENROLLED';
  payload: { id: number; classId: string; isReschedule?: boolean };
}

interface ClassUpdatedEvent {
  type: 'CLASS_UPDATED';
  payload: { classId: string; teacherChanged: boolean; scheduleChanged: boolean };
}

export async function sendEvents(events: WebEvent[]) {
  try {
    await cloudWatchEvents
      .putEvents({
        Entries: events.map(evt => ({
          DetailType: evt.type,
          Detail: JSON.stringify(evt.payload),
          Source: cloudWatchTopic
        }))
      })
      .promise();
  } catch (err) {
    logger.error(err);
  }
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

export function emitClassUpdatedEvent(payload: ClassUpdatedEvent['payload']) {
  const events: ClassUpdatedEvent[] = [
    {
      type: 'CLASS_UPDATED',
      payload
    }
  ];

  return sendEvents(events);
}
