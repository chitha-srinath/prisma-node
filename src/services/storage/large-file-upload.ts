import { FileRepository } from '../../repositories/file.repository';

import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../config/config';

export class LargeFileUploadService {
  private s3Client: S3Client;
  private fileRepository: FileRepository;

  constructor() {
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.fileRepository = new FileRepository();
  }

  async initiateMultipartUpload(payload: {
    fileName: string;
    contentType: string;
    fileSize: number;
    bucket: string;
  }): Promise<{
    uploadId: string;
    key: string;
    presignedUrls: { partNumber: number; url: string }[];
  }> {
    try {
      const { fileName, contentType, fileSize, bucket } = payload;

      const createCmd = new CreateMultipartUploadCommand({
        Bucket: bucket,
        Key: `uploads/${Date.now()}-${fileName}`,
        ContentType: contentType,
      });

      const { UploadId, Key } = await this.s3Client.send(createCmd);
      if (!UploadId || !Key) throw new Error('Failed to initiate multipart');

      // Define part size (5MB is minimum for multipart uploads)
      const PART_SIZE = 5 * 1024 * 1024; // 5MB
      const totalParts = Math.ceil(fileSize / PART_SIZE);

      // Generate all presigned URLs in parallel
      const urls = await Promise.all(
        Array.from({ length: totalParts }, async (_, i) => {
          const partNumber = i + 1;
          const uploadPartCmd = new UploadPartCommand({
            Bucket: bucket,
            Key,
            UploadId,
            PartNumber: partNumber,
          });

          const url = await getSignedUrl(this.s3Client, uploadPartCmd, { expiresIn: 3600 });
          return { partNumber, url };
        }),
      );

      return { uploadId: UploadId, key: Key, presignedUrls: urls };
    } catch (err) {
      console.error(err);
      throw new Error('Failed to initiate multipart upload');
    }
  }

  async completeMultipartUpload(payload: {
    uploadId: string;
    key: string;
    bucket: string;
    parts: { ETag: string; PartNumber: number }[];
  }): Promise<{ message: string; location: string | undefined; key: string }> {
    const { uploadId, key, bucket, parts } = payload;
    const file = await this.fileRepository.findByKeyAndBucket(key, bucket);
    if (!file) throw new Error('File not found');

    try {
      const completeCmd = new CompleteMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
        },
      });

      const result = await this.s3Client.send(completeCmd);

      return {
        message: 'Upload completed',
        location: result.Location,
        key,
      };
    } catch (err) {
      throw new Error(
        `Failed to complete upload: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }

  async abortMultipartUpload(bucket: string, key: string, uploadId: string): Promise<void> {
    try {
      const abortCmd = new AbortMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
      });

      await this.s3Client.send(abortCmd);
    } catch (err) {
      throw new Error(
        `Failed to abort multipart upload: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
}
