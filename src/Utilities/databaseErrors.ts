import { Prisma } from '@prisma/client';
import { DatabaseError } from './ErrorUtility';

export class PrismaErrorHandler {
  static handlePrismaError(error: unknown): DatabaseError | void {
    // let errorMessage = 'Unexpected error';
    let errorMessage = null;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Code: ${error.code} - ${error.message}`;
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      errorMessage = `Unknown request error: ${error.message}`;
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      errorMessage = `Rust panic: ${error.message}`;
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      errorMessage = `Initialization Error: ${error.errorCode} - ${error.message}`;
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      errorMessage = `Validation Error: ${error.message}`;
    }

    if (errorMessage) {
      return new DatabaseError(errorMessage);
    }
  }
}
