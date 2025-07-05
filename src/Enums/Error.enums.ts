/**
 * Enumeration of error types used throughout the application.
 * Provides consistent error type categorization for error handling.
 */
export enum ErrorTypeEnum {
  UNAUTHORIZED = 'UNAUTHORIZED',
  PAYLOAD = 'PAYLOAD',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  DATABASE = 'DATABASE',
  FORBIDDEN = 'FORBIDDEN',
}

/**
 * Enumeration of error messages corresponding to error types.
 * Provides human-readable error messages for each error type.
 */
export enum ErrorMsgEnum {
  UNAUTHORIZED = 'Unauthorized access',
  PAYLOAD = 'Invalid payload',
  NOT_FOUND = 'Resource not found',
  BAD_REQUEST = 'Bad request',
  DATABASE = 'Database error',
  FORBIDDEN = 'Forbidden',
}
