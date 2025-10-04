import { z, object, string, number } from 'zod';

/**
 * Zod schema for generating upload URL validation.
 * Validates fileName, contentType, and bucket fields.
 */
export const GenerateUploadUrlDto = object({
  fileName: string().min(1, { message: 'File name is required' }),
  contentType: string().min(1, { message: 'Content type is required' }),
  bucket: string().min(1, { message: 'Bucket is required' }),
}).strict();

/**
 * Zod schema for generating multiple upload URLs validation.
 * Validates an array of file information.
 */
export const GenerateMultipleUploadUrlsDto = object({
  files: z
    .array(
      object({
        fileName: string().min(1, { message: 'File name is required' }),
        contentType: string().min(1, { message: 'Content type is required' }),
      }),
    )
    .min(1, { message: 'At least one file is required' }),
  bucket: string().min(1, { message: 'Bucket is required' }),
}).strict();

/**
 * Zod schema for download URL parameters validation.
 * Validates bucket and key parameters.
 */
export const DownloadUrlParamsDto = object({
  bucket: string().min(1, { message: 'Bucket is required' }),
  key: string().min(1, { message: 'Key is required' }),
}).strict();

/**
 * Zod schema for initiating multipart upload validation.
 * Validates fileName, contentType, and bucket fields.
 */
export const InitiateMultipartUploadDto = object({
  fileName: string().min(1, { message: 'File name is required' }),
  contentType: string().min(1, { message: 'Content type is required' }),
  bucket: string().min(1, { message: 'Bucket is required' }),
  fileSize: number().optional(),
}).strict();

/**
 * Zod schema for initiating multiple multipart uploads validation.
 * Validates an array of file information.
 */
export const InitiateMultipleMultipartUploadsDto = object({
  files: z
    .array(
      object({
        fileName: string().min(1, { message: 'File name is required' }),
        contentType: string().min(1, { message: 'Content type is required' }),
        fileSize: number().optional(),
      }),
    )
    .min(1, { message: 'At least one file is required' }),
  bucket: string().min(1, { message: 'Bucket is required' }),
}).strict();

/**
 * Zod schema for upload part URL validation.
 * Validates bucket, key, uploadId, and partNumber fields.
 */
export const UploadPartUrlDto = object({
  bucket: string().min(1, { message: 'Bucket is required' }),
  key: string().min(1, { message: 'Key is required' }),
  uploadId: string().min(1, { message: 'Upload ID is required' }),
  partNumber: z.number().int().positive({ message: 'Part number must be a positive integer' }),
}).strict();

/**
 * Zod schema for completing multipart upload validation.
 * Validates bucket, key, uploadId, and parts array.
 */
export const CompleteMultipartUploadDto = object({
  bucket: string().min(1, { message: 'Bucket is required' }),
  key: string().min(1, { message: 'Key is required' }),
  uploadId: string().min(1, { message: 'Upload ID is required' }),
  parts: z
    .array(
      object({
        ETag: string().min(1, { message: 'ETag is required' }),
        PartNumber: z
          .number()
          .int()
          .positive({ message: 'Part number must be a positive integer' }),
      }),
    )
    .min(1, { message: 'Parts array cannot be empty' }),
}).strict();

/**
 * Zod schema for checking upload progress validation.
 * Validates uploadId for tracking progress.
 */
export const UploadProgressDto = object({
  uploadId: string().min(1, { message: 'Upload ID is required' }),
}).strict();

/**
 * TypeScript type for generating upload URL request data.
 * Inferred from GenerateUploadUrlDto schema for type safety.
 */
export type GenerateUploadUrlRequestDto = z.infer<typeof GenerateUploadUrlDto>;

/**
 * TypeScript type for generating multiple upload URLs request data.
 * Inferred from GenerateMultipleUploadUrlsDto schema for type safety.
 */
export type GenerateMultipleUploadUrlsRequestDto = z.infer<typeof GenerateMultipleUploadUrlsDto>;

/**
 * TypeScript type for download URL parameters.
 * Inferred from DownloadUrlParamsDto schema for type safety.
 */
export type DownloadUrlParamsRequestDto = z.infer<typeof DownloadUrlParamsDto>;

/**
 * TypeScript type for initiating multipart upload request data.
 * Inferred from InitiateMultipartUploadDto schema for type safety.
 */
export type InitiateMultipartUploadRequestDto = z.infer<typeof InitiateMultipartUploadDto>;

/**
 * TypeScript type for initiating multiple multipart uploads request data.
 * Inferred from InitiateMultipleMultipartUploadsDto schema for type safety.
 */
export type InitiateMultipleMultipartUploadsRequestDto = z.infer<
  typeof InitiateMultipleMultipartUploadsDto
>;

/**
 * TypeScript type for upload part URL request data.
 * Inferred from UploadPartUrlDto schema for type safety.
 */
export type UploadPartUrlRequestDto = z.infer<typeof UploadPartUrlDto>;

/**
 * TypeScript type for completing multipart upload request data.
 * Inferred from CompleteMultipartUploadDto schema for type safety.
 */
export type CompleteMultipartUploadRequestDto = z.infer<typeof CompleteMultipartUploadDto>;

/**
 * TypeScript type for upload progress request data.
 * Inferred from UploadProgressDto schema for type safety.
 */
export type UploadProgressRequestDto = z.infer<typeof UploadProgressDto>;

export interface UploadResponseDto {
  key: string;
  url?: string;
  uploadUrl?: string;
}

export interface MultipleUploadResponseDto {
  files: {
    key: string;
    url: string;
    uploadUrl: string;
    fileName: string;
  }[];
}

export interface UploadProgressResponseDto {
  uploadId: string;
  fileName: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number; // Percentage (0-100)
  uploadedParts?: number;
  totalParts?: number;
  uploadedBytes?: number;
  totalBytes?: number;
  createdAt: Date;
  updatedAt: Date;
}
