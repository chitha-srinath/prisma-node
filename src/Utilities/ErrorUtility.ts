import { ErrorTypeEnum } from '../Enums/Error.enums';

/**
 * Abstract base class for all application-specific errors.
 * Provides consistent error structure with status codes and error types.
 */
abstract class AppError extends Error {
  status: number;

  /**
   * Creates a new application error with standardized structure.
   * @param name The error type name from ErrorTypeEnum
   * @param message Human-readable error message
   * @param status HTTP status code for the error
   */
  constructor(name: string, message: string, status: number) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

/**
 * Error thrown when request payload validation fails.
 * Used for invalid request body, query parameters, or headers.
 */
export class PayloadError extends AppError {
  /**
   * Creates a new payload validation error.
   * @param message Description of the payload validation failure
   */
  constructor(message: string) {
    super(ErrorTypeEnum.PAYLOAD, message, 400);
  }
}

/**
 * Error thrown when authentication is required but not provided or invalid.
 * Used for missing or invalid authentication tokens.
 */
export class UnauthorizedError extends AppError {
  /**
   * Creates a new unauthorized access error.
   * @param message Description of the authentication failure
   */
  constructor(message: string) {
    super(ErrorTypeEnum.UNAUTHORIZED, message, 401);
  }
}

/**
 * Error thrown when a requested resource is not found.
 * Used for missing database records, files, or endpoints.
 */
export class NotFoundError extends AppError {
  /**
   * Creates a new not found error.
   * @param message Description of what was not found
   */
  constructor(message: string) {
    super(ErrorTypeEnum.NOT_FOUND, message, 404);
  }
}

/**
 * Error thrown for general bad request scenarios.
 * Used for malformed requests that don't fit other specific error categories.
 */
export class BadRequestError extends AppError {
  /**
   * Creates a new bad request error.
   * @param message Description of why the request is invalid
   */
  constructor(message: string) {
    super(ErrorTypeEnum.BAD_REQUEST, message, 400);
  }
}

/**
 * Error thrown when access to a resource is forbidden.
 * Used when the user is authenticated but lacks sufficient permissions.
 */
export class ForbiddenError extends AppError {
  /**
   * Creates a new forbidden access error.
   * @param message Description of the permission denial
   */
  constructor(message: string) {
    super(ErrorTypeEnum.FORBIDDEN, message, 403);
  }
}

/**
 * Error thrown when database operations fail.
 * Used for connection issues, query failures, or constraint violations.
 */
export class DatabaseError extends AppError {
  /**
   * Creates a new database error.
   * @param message Description of the database operation failure
   */
  constructor(message: string) {
    super(ErrorTypeEnum.DATABASE, message, 502);
  }
}
