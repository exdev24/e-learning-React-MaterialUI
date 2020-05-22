import aws from 'aws-sdk';
import config from 'config';

aws.config = new aws.Config({
  accessKeyId: config.get('aws.access_key_id'),
  secretAccessKey: config.get('aws.secret_access_key'),
  region: config.get('aws.region')
});

export const ses = new aws.SES({
  apiVersion: '2010-12-01'
});

export const cloudWatchEvents = new aws.CloudWatchEvents({
  apiVersion: '2015-10-07'
});

export const s3 = new aws.S3({
  apiVersion: '2006-03-01'
});
