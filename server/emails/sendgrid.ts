import { MailData, MailDataRequired } from '@sendgrid/helpers/classes/mail';
import mail from '@sendgrid/mail';
import { canonicalUrl, UnsubscribeGroups } from 'common';
import { UserModel } from 'models';
import { captureException, withScope } from 'sentry';
import config from 'config';
import { request } from 'gaxios';
import { URL } from 'url';
import { routePrefixes } from '../../shared/constants';
import logger from '../lib/logger';
import { notifyEmail, sourceEmail } from './mailer';

// sendgrid
const sandbox = config.get('sendgrid.sandbox') as boolean;
const mailmanKey = config.get('sendgrid.mailmanKey') as string;
const validatorKey = config.get('sendgrid.validatorKey') as string;

mail.setApiKey(mailmanKey);

export async function sendTemplatedEmail(
  templateId: string,
  opts: Pick<
    MailData,
    | 'from'
    | 'cc'
    | 'to'
    | 'bcc'
    | 'asm'
    | 'dynamicTemplateData'
    | 'sendAt'
    | 'category'
    | 'customArgs'
  >,
  ga?: {
    source: string;
    campaign: string;
  }
) {
  const data: MailDataRequired = {
    ...opts,
    templateId,
    mailSettings: {
      sandboxMode: { enable: sandbox }
    }
  };

  if (ga) {
    data.trackingSettings = {
      ganalytics: {
        enable: true,
        utmCampaign: ga.campaign,
        utmSource: ga.source,
        utmMedium: 'email'
      }
    };
  }

  try {
    await mail.send(data);
  } catch (err) {
    withScope(scope => {
      scope.setTag('service', 'sendgrid');
      scope.setExtras(opts);
      captureException(err);
    });

    logger.error({ err, opts }, 'fail to send email to %o', opts.to);
  }
}

interface ValidationResult {
  email: string;
  verdict: 'Valid' | 'Risky' | 'Invalid';
  suggestion: string;
  host: string;
  local: string;
}

export async function validateEmail(opts: { email: string; source?: string }) {
  const result = {
    rejected: false,
    errorMessage: 'skipped'
  };

  if (sandbox) {
    return result;
  }

  try {
    const res = await request<{ result: ValidationResult }>({
      url: 'https://api.sendgrid.com/v3/validations/email',
      timeout: 2000,
      method: 'POST',
      data: opts,
      headers: {
        Authorization: 'Bearer ' + validatorKey
      }
    });

    const { verdict, suggestion, host, local } = res.data.result;
    if (verdict !== 'Valid') {
      logger.warn(res.data.result, 'Email Validation Error');
    }

    if (verdict !== 'Valid' && suggestion && suggestion !== host) {
      result.rejected = true;
      result.errorMessage = `Did you mean ${local}@${suggestion}?`;
    } else if (verdict === 'Invalid') {
      result.rejected = true;
      result.errorMessage = 'Not a valid email, try again';
    }
  } catch (err) {
    withScope(scope => {
      scope.setTag('service', 'sendgrid');
      captureException(err);
    });

    logger.error(err, 'fail to validate email  %o', opts.email);
  }

  return result;
}

export async function sendReferralInvite(user: UserModel, email: string) {
  const referralLink = new URL(routePrefixes.ref + user.referralCode, canonicalUrl);

  logger.info({ userId: user.id, email }, 'referral invite');

  await sendTemplatedEmail('d-25f09a6072164c2bb3f22c264e45ea0b', {
    from: sourceEmail,
    to: email,
    bcc: notifyEmail,
    asm: {
      groupId: UnsubscribeGroups.Promotions
    },
    customArgs: {
      userId: user.id
    },
    dynamicTemplateData: {
      referrer: user.firstName,
      referralLink: referralLink.toString()
    }
  });
}
