import { CreateUserData, UpdateUserData } from '@/Dtos/user.dto';
import { UserRepository } from '../repositories/user.repositiory';

import { User } from '@prisma/client';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createuser(data: CreateUserData): Promise<User> {
    return this.userRepository.insert(data);
  }

  async getAllusers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getuserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async updateuser(id: number, data: UpdateUserData): Promise<User> {
    const User = await this.userRepository.findById(id);
    if (!User) {
      throw new Error('User not found');
    }
    return this.userRepository.update(id, data);
  }

  async deleteuser(id: number): Promise<User> {
    const User = await this.userRepository.findById(id);
    if (!User) {
      throw new Error('User not found');
    }
    return this.userRepository.delete(id);
  }
}
