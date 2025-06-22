export interface AuthenticatedRequest extends Request {
  user: UserDetails;
  session: UserSession;
}

export interface UserSession {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

export interface UserDetails {
  username: string;
  id: string;
  avatarUrl: string;
  email: string;
}
