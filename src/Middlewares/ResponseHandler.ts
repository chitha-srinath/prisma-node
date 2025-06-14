import { Response } from 'express';

export class ResponseHandler {
  static sucessResponse(res: Response, data: any, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      error: false,
      message,
      data,
    });
  }
  static errorResponse(res: Response, message: string, statusCode = 500) {
    return res.status(statusCode).json({
      error: true,
      message,
      data: null,
    });
  }
}
