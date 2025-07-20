import { Response } from 'express';

/**
 * Utility class for standardizing API responses across the application.
 * Provides consistent success and error response formats.
 */
export class ResponseHandler {
  /**
   * Sends a standardized success response to the client.
   * @param res Express response object
   * @param data The data to send in the response
   * @param message Optional success message (defaults to 'Success')
   * @param statusCode Optional HTTP status code (defaults to 200)
   * @returns Express response object
   */
  static successResponse<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
  ): Response {
    return res.status(statusCode).json({
      error: false,
      message,
      data,
    });
  }

  /**
   * Sends a standardized error response to the client.
   * @param res Express response object
   * @param message Error message to send
   * @param statusCode Optional HTTP status code (defaults to 500)
   * @returns Express response object
   */
  static errorResponse(res: Response, message: string, statusCode = 500): Response {
    return res.status(statusCode).json({
      error: true,
      message,
      data: null,
    });
  }
}
