import { Post } from '@prisma/client';
import { BaseRepository } from './baserepostiory';
import { PrismaClient } from '@prisma/client';

export class PostRepository extends BaseRepository<Post, PrismaClient['post']> {
  constructor() {
    super((prisma) => prisma.post);
  }

  async findbyQuery(matchQuery: Partial<Post>): Promise<Post[]> {
    const result = await this.getModel().findMany({
      where: matchQuery,
    });
    return result;
  }
}
