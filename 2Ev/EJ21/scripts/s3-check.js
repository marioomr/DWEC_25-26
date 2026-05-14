require('dotenv').config();

const {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');

const requiredEnv = [
  'FILEBASE_ENDPOINT',
  'FILEBASE_ACCESS_KEY',
  'FILEBASE_SECRET_KEY',
  'FILEBASE_BUCKET',
];

const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing env:', missing.join(', '));
  process.exit(1);
}

const s3 = new S3Client({
  endpoint: process.env.FILEBASE_ENDPOINT,
  region: process.env.FILEBASE_REGION || 'us-east-1',
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY,
    secretAccessKey: process.env.FILEBASE_SECRET_KEY,
  },
});

(async () => {
  try {
    const lbs = await s3.send(new ListBucketsCommand({}));
    const names = (lbs.Buckets || []).map((b) => b.Name);
    console.log('ListBuckets OK:', names.length ? names : '(no buckets returned)');
  } catch (e) {
    console.error('ListBuckets ERROR:', e.name, e.Code, e.$metadata && e.$metadata.httpStatusCode);
  }

  try {
    await s3.send(
      new ListObjectsV2Command({ Bucket: process.env.FILEBASE_BUCKET, MaxKeys: 1 })
    );
    console.log('ListObjectsV2 OK:', process.env.FILEBASE_BUCKET);
  } catch (e) {
    console.error('ListObjectsV2 ERROR:', e.name, e.Code, e.$metadata && e.$metadata.httpStatusCode);
    console.error(e);
  }
})();
