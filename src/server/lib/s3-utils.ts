import dataUrls from 'data-urls';
import urlJoin from 'url-join';
import { s3, s3Config } from './aws';

const baseFolder = 'user-content';

function getFileKey(filePath: string, fileName: string) {
  return urlJoin(baseFolder, filePath, fileName.replace(/\s+/g, ''));
}

export async function getUploadUrl(
  filePath: string,
  opts: {
    name: string;
    type: string;
  }
) {
  const fileKey = getFileKey(filePath, opts.name);
  const uploadUrl = await s3.getSignedUrlPromise('putObject', {
    ContentType: opts.type,
    Key: fileKey,
    Bucket: s3Config.bucket,
    Expires: 600,
    ACL: 'public-read',
    CacheControl: 'public, max-age=2592000, immutable'
  });

  return {
    fileKey,
    uploadUrl,
    fileUrl: urlJoin(s3Config.cndUrl, fileKey)
  };
}

export async function uploadFile(
  filePath: string,
  opts: { name: string; content: string }
) {
  const file = dataUrls(opts.content);

  if (!file.mimeType || file.mimeType.type !== 'image') {
    throw new TypeError('Not a valid image file');
  }

  const fileName = opts.name + '.' + file.mimeType.subtype;
  const fileKey = getFileKey(filePath, fileName);

  await s3
    .putObject({
      Key: fileKey,
      Body: file.body,
      ContentEncoding: 'base64',
      ContentType: file.mimeType.toString(),
      Bucket: s3Config.bucket,
      ACL: 'public-read',
      CacheControl: 'public, max-age=2592000, immutable'
    })
    .promise();

  return {
    fileKey,
    fileUrl: urlJoin(s3Config.cndUrl, fileKey)
  };
}
