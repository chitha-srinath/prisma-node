import { user } from '@prisma/client';

import { UserRepository } from '../Repositories/user.repostiory';
import { CreateUserData, UpdateUserData } from '../Dtos/user.dto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createuser(data: CreateUserData): Promise<user> {
    return this.userRepository.create(data);
  }

  async getAllusers(): Promise<user[]> {
    return this.userRepository.findAll();
  }

  async getuserById(id: number): Promise<user | null> {
    return this.userRepository.findById(id);
  }

  async updateuser(id: number, data: UpdateUserData) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('user not found');
    }
    return this.userRepository.update(id, data);
  }

  async deleteuser(id: number): Promise<user> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('user not found');
    }
    return this.userRepository.delete(id);
  }
}
