import { LoginPostDto, RegisterPostDto } from '@/Dtos/auth.dto';

/**
 * Service for authentication logic such as sign in, sign up, and access token retrieval.
 */
export class AuthService {
  //   constructor() {}

  /**
   * Authenticates a user and returns login data.
   * @param data Login credentials
   * @returns LoginPostDto containing user/session info
   */
  async signIn(data: LoginPostDto): Promise<LoginPostDto> {
    return data;
  }

  /**
   * Registers a new user and returns registration data.
   * @param data Registration details
   * @returns RegisterPostDto containing new user info
   */
  async signUp(data: RegisterPostDto): Promise<RegisterPostDto> {
    return data;
  }

  /**
   * Retrieves a new access token using a refresh token.
   * @param token Refresh token string
   * @returns New access token string
   */
  async fetchAcessToken(token: string): Promise<string> {
    return token;
  }
}
