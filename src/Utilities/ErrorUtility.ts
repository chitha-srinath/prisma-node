import { ErrorTypeEnum } from '../Enums/Error.enums';

abstract class AppError extends Error {
  status: number;

  constructor(name: string, message: string, status: number) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class PayloadError extends AppError {
  constructor(message: string) {
    super(ErrorTypeEnum.PAYLOAD, message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(ErrorTypeEnum.UNAUTHORIZED, message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(ErrorTypeEnum.NOT_FOUND, message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(ErrorTypeEnum.BAD_REQUEST, message, 400);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(ErrorTypeEnum.FORBIDDEN, message, 403);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(ErrorTypeEnum.DATABASE, message, 500);
  }
}
