import { Response } from 'express';

export class ResponseHandler {
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
  static errorResponse(res: Response, message: string, statusCode = 500): Response {
    return res.status(statusCode).json({
      error: true,
      message,
      data: null,
    });
  }
}
