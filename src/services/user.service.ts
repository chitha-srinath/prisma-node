import { CreateUserData, UpdateUserData } from '@/Dtos/user.dto';
import { UserRepository } from '../repositories/user.repositiory';

import { User } from '@prisma/client';

/**
 * Service for user-related business logic.
 * Handles creation, retrieval, update, and deletion of users.
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
   * Creates a new user.
   * @param data Data for the new user
   * @returns The created User object
   */
  async createuser(data: CreateUserData): Promise<User> {
    return this.userRepository.insert(data);
  }

  /**
   * Retrieves all users.
   * @returns Array of User objects
   */
  async getAllusers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  /**
   * Retrieves a user by their ID.
   * @param id User ID
   * @returns The User object or null if not found
   */
  async getuserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Updates a user by their ID.
   * @param id User ID
   * @param data Data to update the user
   * @returns The updated User object
   * @throws Error if user is not found
   */
  async updateuser(id: number, data: UpdateUserData): Promise<User> {
    const User = await this.userRepository.findById(id);
    if (!User) {
      throw new Error('User not found');
    }
    return this.userRepository.update({ id: String(id) }, data);
  }

  /**
   * Deletes a user by their ID.
   * @param id User ID
   * @returns The deleted User object
   * @throws Error if user is not found
   */
  async deleteuser(id: number): Promise<User> {
    const User = await this.userRepository.findById(id);
    if (!User) {
      throw new Error('User not found');
    }
    return this.userRepository.delete(id);
  }
}
