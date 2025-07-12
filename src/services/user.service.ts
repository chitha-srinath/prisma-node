import { CreateUserData, UpdateUserData } from '@/Dtos/user.dto';
import {
  UserRepository,
  AccountRespository,
  SessionRepository,
} from '../repositories/user.repositiory';
import { User } from '@prisma/client';
import { NotFoundError } from '../Utilities/ErrorUtility';

/**
 * Service for user-related business logic.
 * Handles creation, retrieval, update, and deletion of users.
 * Provides a clean interface between controllers and repositories.
 */
export class UserService {
  private userRepository: UserRepository;
  private accountRepository: AccountRespository;
  private sessionRepository: SessionRepository;

  /**
   * Initializes the UserService and its UserRepository dependency.
   */
  constructor() {
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRespository();
    this.sessionRepository = new SessionRepository();
  }

  /**
   * Creates a new user with the provided data.
   * @param data Data for the new user including email, password, and other user details
   * @returns Promise resolving to the created User object
   */
  async createuser(data: CreateUserData): Promise<User> {
    return this.userRepository.insert(data);
  }

  /**
   * Retrieves all users from the database.
   * @returns Promise resolving to an array of User objects
   */
  async getAllusers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  /**
   * Retrieves a specific user by their ID.
   * @param id The unique identifier of the user
   * @returns Promise resolving to the User object or null if not found
   */
  async getuserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Updates an existing user with new data.
   * @param id The unique identifier of the user to update
   * @param data The new data to update the user with
   * @returns Promise resolving to the updated User object
   * @throws NotFoundError if the user with the given ID is not found
   */
  async updateuser(id: number, data: UpdateUserData): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.userRepository.update({ id: String(id) }, data);
  }

  /**
   * Deletes a user by their ID.
   * @param id The unique identifier of the user to delete
   * @returns Promise resolving to the deleted User object
   * @throws NotFoundError if the user with the given ID is not found
   */
  async deleteuser(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.userRepository.delete(id);
  }

  /**
   * Finds a user by Google info or creates a new one if not found. Links Google account if needed.
   * @param googleUserInfo Google user info object
   * @returns Promise resolving to the found or created User object
   */
  async findOrCreateGoogleUser(googleUserInfo: {
    email: string;
    id: string;
    name: string;
    picture?: string;
  }): Promise<User> {
    // Try to find user by email
    let user = await this.userRepository.findFirst({ email: googleUserInfo.email });

    if (!user) {
      // Create new user
      user = await this.userRepository.insert({
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        emailVerified: true,
        image: googleUserInfo.picture,
        createdAt: new Date(),
      });
    } else if (!user.emailVerified) {
      // Optionally update emailVerified and image if not set
      user = await this.userRepository.update(
        { id: String(user.id) },
        {
          emailVerified: true,
          image: googleUserInfo.picture,
        },
      );
    }

    // Add or update Account for Google provider
    const providerId = 'google';
    const accountId = googleUserInfo.id;
    const existingAccount = await this.accountRepository.findFirst({
      providerId,
      accountId,
      userId: user.id,
    });
    if (!existingAccount) {
      await this.accountRepository.insert({
        id: accountId, // assuming Google ID is unique
        accountId,
        providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { connect: { id: user.id } },
      });
    }

    return user;
  }

  async createSession(payload: { userId: string; sessionId: string }): Promise<void> {
    await this.sessionRepository.insert({
      id: payload.sessionId,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { connect: { id: payload.userId } },
    });
  }
}
