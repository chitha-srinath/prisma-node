/**
 * Enumeration of request payload types for validation.
 * Specifies which part of the HTTP request should be validated.
 */
export enum PayLoadType {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
}
