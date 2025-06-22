import { User } from '@prisma/client';
import { BaseRepository } from './baserepostiory';

// Todo repository implementation
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super((prisma) => prisma.user);
  }
}
