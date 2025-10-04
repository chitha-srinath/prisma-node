/**
 * Interface for file metadata stored in the database
 */
export interface FileMetadata {
  id: string;
  name: string;
  size: number | null;
  mimeType: string | null;
  key: string;
  bucket: string;
  url: string | null;
  status: string;
  uploadedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for upload parameters
 */
export interface UploadParams {
  bucket: string;
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
}

/**
 * Interface for presigned URL parameters
 */
export interface PresignedUrlParams {
  bucket: string;
  key: string;
  contentType?: string;
  expiresIn?: number;
  metadata?: Record<string, string>;
}

/**
 * Interface for multipart upload parameters
 */
export interface MultipartUploadParams {
  bucket: string;
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
}

/**
 * Interface for presigned upload part parameters
 */
export interface PresignedUploadPartParams {
  bucket: string;
  key: string;
  uploadId: string;
  partNumber: number;
  expiresIn?: number;
}

/**
 * Interface for upload progress tracking
 */
export interface UploadProgress {
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
