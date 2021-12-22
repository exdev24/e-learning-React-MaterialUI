import AWS from 'aws-sdk';
import config from 'config';

AWS.config = new AWS.Config({
  accessKeyId: config.get('aws.access_key_id'),
  secretAccessKey: config.get('aws.secret_access_key'),
  region: config.get('aws.region')
});

export const cloudWatchTopic = config.get('aws.topic') as string;
export const cloudWatchEvents = new AWS.CloudWatchEvents();

export const s3 = new AWS.S3();
export const s3Config = config.get('aws.s3') as {
  cndUrl: string;
  bucket: string;
};

export const ses = new AWS.SESV2();
export const sendSESEmail = (params: AWS.SESV2.Types.SendEmailRequest) =>
  ses.sendEmail(params).promise();

export const sns = new AWS.SNS();
export const publishSMS = (
  PhoneNumber: AWS.SNS.Types.PhoneNumber,
  Message: AWS.SNS.Types.message
) =>
  sns
    .publish({
      PhoneNumber,
      Message
    })
    .promise();
