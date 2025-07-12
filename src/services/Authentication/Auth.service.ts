import { LoginPostDto, RegisterPostDto } from '../../Dtos/auth.dto';
import { hashPassword, verifyPassword, generateJwtToken } from '../../Utilities/encrypt-hash';
import { UnauthorizedError, BadRequestError } from '../../Utilities/ErrorUtility';
import { randomUUID } from 'node:crypto';
import { UserRepository } from '../../repositories/user.repositiory';
import { AccountRepository } from '../../repositories/account.repository';
import { SessionRepository } from '../../repositories/session.repository';

/**
 * Service for authentication logic such as sign in, sign up, and access token retrieval.
 */
export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly accountRepository: AccountRepository;
  private readonly sessionRepository: SessionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRepository();
    this.sessionRepository = new SessionRepository();
  }

  /**
   * Authenticates a user and returns login data.
   * @param data Login credentials
   * @returns AuthResponse containing user info and tokens
   */
  async signIn(data: LoginPostDto): Promise<{ accessToken: string; refreshToken: string }> {
    // Find user by email with accounts
    const user = await this.userRepository.findByEmailWithAccounts(data.email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user has password account
    const passwordAccount = user.accounts[0];
    if (!passwordAccount?.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, passwordAccount.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const sessionId = randomUUID();
    const accessToken = generateJwtToken(
      {
        userId: user.id,
        email: user.email,
        sessionId: sessionId,
      },
      { expiresIn: '15m' },
    );

    const refreshToken = generateJwtToken(
      {
        sessionId: sessionId,
        userId: user.id,
      },
      { expiresIn: '7d' },
    );

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.sessionRepository.createSession(sessionId, user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Registers a new user and returns registration data.
   * @param data Registration details
   * @returns AuthResponse containing new user info and tokens
   */
  async signUp(data: RegisterPostDto): Promise<string> {
    // Check if user already exists
    const existingUser = await this.userRepository.findFirst({ email: data.email });

    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await this.userRepository.createUser({
      name: data.email.split('@')[0],
      email: data.email,
      isActive: true,
      emailVerified: false,
    });

    // Create password account
    await this.accountRepository.createPasswordAccount(user.id, hashedPassword);

    return 'user sign up sucessfully';
  }

  /**
   * Retrieves a new access token using a refresh token.
   * @param token Refresh token string
   * @returns New access token string
   */
  async fetchAcessToken(token: string): Promise<string> {
    // Find session by refresh token
    const session = await this.sessionRepository.findByTokenWithUser(token);

    if (!session) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if session is expired
    if (session.expiresAt && session.expiresAt < new Date()) {
      // Delete expired session
      await this.sessionRepository.deleteUnique({ id: session.id });
      throw new UnauthorizedError('Refresh token expired');
    }

    // Generate new access token
    const accessToken = generateJwtToken(
      {
        userId: session.user.id,
        email: session.user.email,
        sessionId: session.id,
      },
      { expiresIn: '15m' },
    );

    return accessToken;
  }

  /**
   * Logs out a user by invalidating their session.
   * @param sessionId Session ID to invalidate
   */
  async logout(sessionId: string): Promise<void> {
    await this.sessionRepository.deleteUnique({ id: sessionId });
  }
}
