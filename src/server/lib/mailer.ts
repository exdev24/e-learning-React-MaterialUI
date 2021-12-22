import { MailData, MailDataRequired } from '@sendgrid/helpers/classes/mail';
import mail from '@sendgrid/mail';
import { captureException, withScope } from '@sentry/node';
import { canonicalUrl, UnsubscribeGroups } from 'cl-common';
import { ClassModel, StudentModel, UserModel } from 'cl-models';
import config from 'config';
import { URL } from 'url';
import { routePrefixes } from '../../shared/constants';
import logger from '../lib/logger';

//email
export const notifyEmail = config.get('email.notify') as string;
export const sourceEmail = config.get('email.source') as string;
export const MsOps = config.get('email.ops') as string;

// sendgrid
const sandbox = config.get('sendgrid.sandbox') as boolean;
mail.setApiKey(config.get('sendgrid.mailmanKey'));

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

export async function sendRequestCertificateEmailWithPdf(
  student: StudentModel,
  klass: ClassModel,
  content: string
) {
  const userProfileLink = 'https://ops.create-learn.com/users/' + student.parentId;
  const classProfileLink = 'https://ops.create-learn.com/classes/' + klass.id;
  const html = `
  <h1>User request for class certificate</h1>
  <p>
    <strong>User:</strong> <a href="${userProfileLink}">${student.parent.email}</a>
  </p>
  <p>
    <strong>Student:</strong> ${student.name}
  </p>
  <p>
    <strong>Course:</strong> <a href="${classProfileLink}">${klass.course.name}</a>
  </p>`;

  const data: MailDataRequired = {
    from: sourceEmail,
    to: MsOps,
    subject: 'User request for Certificate of Achievement',
    html: html,
    attachments: [
      {
        content,
        filename: 'certificate.pdf',
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  };

  await mail.send(data);
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
