import { CreateUserData, UpdateUserData } from '@/Dtos/user.dto';
import { UserRepository } from '../repositories/user.repositiory';
import { User } from '@prisma/client';
import { NotFoundError } from '../Utilities/ErrorUtility';

/**
 * Service for user-related business logic.
 * Handles creation, retrieval, update, and deletion of users.
 * Provides a clean interface between controllers and repositories.
 */
export class UserService {
  private userRepository: UserRepository;

  /**
   * Initializes the UserService and its UserRepository dependency.
   */
  constructor() {
    this.userRepository = new UserRepository();
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
}
