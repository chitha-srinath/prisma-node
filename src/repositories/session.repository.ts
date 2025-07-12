import { Session, PrismaClient, Prisma } from '@prisma/client';
import { BaseRepository } from './baserepostiory';

/**
 * Repository for Session entity operations.
 * Extends BaseRepository to provide type-safe database operations for Session model.
 * Handles all CRUD operations and advanced queries for session data.
 */
export class SessionRepository extends BaseRepository<
  Session,
  Prisma.SessionCreateInput,
  Prisma.SessionUpdateInput,
  Prisma.SessionWhereInput,
  Prisma.SessionWhereUniqueInput,
  PrismaClient['session']
> {
  /**
   * Initializes the SessionRepository with Prisma session model.
   * Sets up the repository to work with the Session entity in the database.
   */
  constructor() {
    super((prisma: PrismaClient) => prisma.session);
  }

  /**
   * Finds the first session matching the query.
   * @param where Query filter
   * @returns The first matching session or null
   */
  async findFirst(where: Prisma.SessionWhereInput): Promise<Session | null> {
    return this.getModel().findFirst({ where });
  }

  /**
   * Finds session by token with user information.
   * @param token Session token
   * @returns Session with user data or null
   */
  async findByTokenWithUser(token: string): Promise<(Session & { user: any }) | null> {
    return this.getModel().findUnique({
      where: { token },
      include: { user: true },
    });
  }

  /**
   * Creates a new session for a user.
   * @param sessionId Session ID
   * @param userId User ID
   * @param refreshToken Refresh token string
   * @param expiresAt Session expiration date
   * @returns Created session
   */
  async createSession(
    sessionId: string,
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<Session> {
    return this.getModel().create({
      data: {
        id: sessionId,
        token: refreshToken,
        userId,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Deletes expired sessions.
   * @returns Number of deleted sessions
   */
  async deleteExpiredSessions(): Promise<number> {
    const result = await this.getModel().deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  }
}
