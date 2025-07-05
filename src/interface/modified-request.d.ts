import { Request } from 'express';

/**
 * Extended Express Request interface for authenticated requests.
 * Adds user and session information to the standard Express request object.
 */
export interface AuthenticatedRequest extends Request {
  user: UserDetails;
  session: UserSession;
}

/**
 * Interface representing a user session in the system.
 * Contains session metadata and lifecycle information.
 */
export interface UserSession {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

/**
 * Interface representing user details attached to authenticated requests.
 * Contains essential user information for request processing.
 */
export interface UserDetails {
  username: string;
  id: string;
  avatarUrl: string;
  email: string;
}
