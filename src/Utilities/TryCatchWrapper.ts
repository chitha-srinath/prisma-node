/**
 * Utility types and functions for handling async operations with error handling.
 * Provides a Result type pattern for better error handling in async operations.
 */

/**
 * Represents a successful operation result.
 * @template T The type of the successful data
 */
type Success<T> = {
  data: T;
  error: null;
};

/**
 * Represents a failed operation result.
 * @template E The type of the error
 */
type Failure<E> = {
  data: null;
  error: E;
};

/**
 * Union type representing either a success or failure result.
 * @template T The type of the successful data
 * @template E The type of the error (defaults to Error)
 */
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Wraps an async operation in a try-catch block and returns a Result type.
 * Provides a consistent way to handle async operations with error handling.
 * @param promise The promise to wrap and execute
 * @returns Promise resolving to a Result containing either data or error
 */
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
