import { randomUUID } from 'node:crypto';
import axios from 'axios';
import { config } from '../../config/config';

// interface GoogleTokenResponse {
//   access_token: string;
//   expires_in: number;
//   refresh_token?: string;
//   scope: string;
//   token_type: string;
//   id_token?: string;
// }

// interface GoogleUserInfo {
//   id: string;
//   email: string;
//   verified_email: boolean;
//   name: string;
//   given_name: string;
//   family_name: string;
//   picture: string;
//   locale: string;
// }

export class GoogleOAuthService {
  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private redirectUri: string | undefined;
  private scope: string;

  constructor() {
    this.clientId = config.GOOGLE_CLIENT_ID;
    this.clientSecret = config.GOOGLE_CLIENT_SECRET;
    this.redirectUri = config.GOOGLE_REDIRECT_URI;
    this.scope = 'openid email profile';
  }

  // Generate Google OAuth URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId || '',
      redirect_uri: this.redirectUri || '',
      response_type: 'code',
      scope: this.scope,
      access_type: 'offline',
      prompt: 'consent',
      state: randomUUID(), // CSRF protection
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  // Exchange authorization code for Google tokens
  async exchangeCodeForTokens(code: string): Promise<unknown> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to exchange code for tokens');
    }
  }

  // Get user info from Google
  async getUserInfo(accessToken: string): Promise<unknown> {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to get user info from Google');
    }
  }
}
