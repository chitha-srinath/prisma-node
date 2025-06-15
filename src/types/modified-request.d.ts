interface AuthenticatedRequest extends Request {
  user: UserDetails;
}

interface UserDetails {
  username: string;
  id: string;
  avatarUrl: string;
  email: string;
}
