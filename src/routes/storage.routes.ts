import { Router } from 'express';
import { StorageController } from '../Controllers/storage.controller';
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
  validatePayload(CompleteMultipartUploadDto, PayLoadType.BODY),
  storageController.completeMultipartUpload,
);

/**
 * @route GET /storage/progress/:uploadId
 * @desc Get upload progress for a multipart upload
 * @access Private
 */
router.get('/progress/:uploadId', storageController.getUploadProgress);

/**
 * @route POST /storage/upload
 * @desc Direct file upload (simplified version)
 * @access Private
 */
router.post('/upload', storageController.uploadFile);

/**
 * @route GET /storage/download-url/:bucket/:key
 * @desc Generate a presigned URL for file download
 * @access Private
 */
router.get('/download-url/:bucket/:key', storageController.generateDownloadUrl);

export default router;
