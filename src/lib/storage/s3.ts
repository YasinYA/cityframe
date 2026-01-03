import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET = process.env.S3_BUCKET || "cityframe-wallpapers";

// Public URL may differ from internal endpoint (e.g., CDN or external MinIO URL)
const PUBLIC_URL = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || "http://localhost:9000";

export async function uploadImage(
  key: string,
  buffer: Buffer,
  contentType: string = "image/png"
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return the public URL
  return `${PUBLIC_URL}/${BUCKET}/${key}`;
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteImage(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

export function generateStorageKey(
  jobId: string,
  device: string,
  style: string
): string {
  const timestamp = Date.now();
  return `wallpapers/${jobId}/${device}-${style}-${timestamp}.png`;
}
