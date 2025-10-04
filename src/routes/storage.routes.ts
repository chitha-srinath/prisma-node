import { Router } from 'express';
import { StorageController } from '../Controllers/storage.controller';
import { requireAuth } from '../middlewares/Authentication';
import { validatePayload } from '../middlewares/Payload-verify';
import { PayLoadType } from '../Enums/payload.enum';
import {
  GenerateUploadUrlDto,
  InitiateMultipartUploadDto,
  UploadPartUrlDto,
  CompleteMultipartUploadDto,
  GenerateMultipleUploadUrlsDto,
  InitiateMultipleMultipartUploadsDto,
} from '../Dtos/storage.dto';

const router = Router();
const storageController = new StorageController();

/**
 * @route POST /storage/upload-url
 * @desc Generate a presigned URL for file upload
 * @access Private
 */
router.post(
  '/upload-url',
  requireAuth,
  validatePayload(GenerateUploadUrlDto, PayLoadType.BODY),
  storageController.generateUploadUrl,
);

/**
 * @route POST /storage/multiple-upload-urls
 * @desc Generate presigned URLs for multiple file uploads
 * @access Private
 */
router.post(
  '/multiple-upload-urls',
  requireAuth,
  validatePayload(GenerateMultipleUploadUrlsDto, PayLoadType.BODY),
  storageController.generateMultipleUploadUrls,
);

/**
 * @route POST /storage/multipart/initiate
 * @desc Initiate a multipart upload for large files
 * @access Private
 */
router.post(
  '/multipart/initiate',
  requireAuth,
  validatePayload(InitiateMultipartUploadDto, PayLoadType.BODY),
  storageController.initiateMultipartUpload,
);

/**
 * @route POST /storage/multipart/initiate-multiple
 * @desc Initiate multipart uploads for multiple large files
 * @access Private
 */
router.post(
  '/multipart/initiate-multiple',
  requireAuth,
  validatePayload(InitiateMultipleMultipartUploadsDto, PayLoadType.BODY),
  storageController.initiateMultipleMultipartUploads,
);

/**
 * @route POST /storage/multipart/upload-part-url
 * @desc Generate a presigned URL for a specific part of a multipart upload
 * @access Private
 */
router.post(
  '/multipart/upload-part-url',
  requireAuth,
  validatePayload(UploadPartUrlDto, PayLoadType.BODY),
  storageController.generateUploadPartUrl,
);

/**
 * @route POST /storage/multipart/complete
 * @desc Complete a multipart upload
 * @access Private
 */
router.post(
  '/multipart/complete',
  requireAuth,
  validatePayload(CompleteMultipartUploadDto, PayLoadType.BODY),
  storageController.completeMultipartUpload,
);

/**
 * @route GET /storage/progress/:uploadId
 * @desc Get upload progress for a multipart upload
 * @access Private
 */
router.get('/progress/:uploadId', requireAuth, storageController.getUploadProgress);

/**
 * @route POST /storage/upload
 * @desc Direct file upload (simplified version)
 * @access Private
 */
router.post('/upload', requireAuth, storageController.uploadFile);

/**
 * @route GET /storage/download-url/:bucket/:key
 * @desc Generate a presigned URL for file download
 * @access Private
 */
router.get('/download-url/:bucket/:key', requireAuth, storageController.generateDownloadUrl);

export default router;
