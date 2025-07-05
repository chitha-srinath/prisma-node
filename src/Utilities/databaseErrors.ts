import { Prisma } from '@prisma/client';
import { DatabaseError } from './ErrorUtility';
import { LoggerUtility } from './LoggerUtility';

/**
 * Utility class for handling Prisma database errors.
 * Provides centralized error handling and logging for all Prisma-related errors.
 * Converts Prisma errors into standardized DatabaseError instances.
 */
export class PrismaErrorHandler {
  private static logger: LoggerUtility;

  /**
   * Sets the logger instance for error logging.
   * @param logger LoggerUtility instance for logging database errors
   */
  static setLogger(logger: LoggerUtility): void {
    PrismaErrorHandler.logger = logger;
  }

  /**
   * Handles various types of Prisma errors and converts them to DatabaseError.
   * Logs detailed error information and provides standardized error responses.
   * @param error The error object to handle (can be any Prisma error type)
   * @returns DatabaseError instance with appropriate error message
   */
  static handlePrismaError(error: unknown): DatabaseError {
    let errorMessage = 'Unexpected database error';
    let errorDetails = {};

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database constraint error: ${error.code}`;
      errorDetails = {
        code: error.code,
        modelName: error.meta?.modelName,
        constraint: error.meta?.constraint,
        cause: error.meta?.cause,
        target: error.meta?.target,
      };

      // Log specific known errors
      if (PrismaErrorHandler.logger) {
        PrismaErrorHandler.logger.error(
          `Prisma Known Request Error: ${error.code} - ${error.message}`,
        );
        PrismaErrorHandler.logger.error(`Error details: ${JSON.stringify(errorDetails)}`);
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      errorMessage = 'Unknown database request error';
      errorDetails = { message: error.message };

      if (PrismaErrorHandler.logger) {
        PrismaErrorHandler.logger.error(`Prisma Unknown Request Error: ${error.message}`);
      }
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      errorMessage = 'Database system error (Rust panic)';
      errorDetails = { message: error.message };

      if (PrismaErrorHandler.logger) {
        PrismaErrorHandler.logger.error(`Prisma Rust Panic Error: ${error.message}`);
      }
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      errorMessage = 'Database initialization error';
      errorDetails = {
        errorCode: error.errorCode,
        message: error.message,
      };

      if (PrismaErrorHandler.logger) {
        PrismaErrorHandler.logger.error(
          `Prisma Initialization Error: ${error.errorCode} - ${error.message}`,
        );
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      errorMessage = 'Database validation error';
      errorDetails = { message: error.message };

      if (PrismaErrorHandler.logger) {
        PrismaErrorHandler.logger.error(`Prisma Validation Error: ${error.message}`);
      }
    } else {
      // Handle generic errors
      const genericError = error as Error;
      errorMessage = 'Unexpected database error';
      errorDetails = {
        message: genericError.message,
        stack: genericError.stack,
      };

      if (PrismaErrorHandler.logger) {
        PrismaErrorHandler.logger.error(`Unexpected Database Error: ${genericError.message}`);
        if (genericError.stack) {
          PrismaErrorHandler.logger.error(`Stack trace: ${genericError.stack}`);
        }
      }
    }

    // Log additional context if logger is available
    if (PrismaErrorHandler.logger) {
      PrismaErrorHandler.logger.error(`Database error occurred: ${errorMessage}`);
      PrismaErrorHandler.logger.error(`Error details: ${JSON.stringify(errorDetails)}`);
    }

    return new DatabaseError('Database error');
  }
}
