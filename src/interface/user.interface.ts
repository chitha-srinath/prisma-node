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
