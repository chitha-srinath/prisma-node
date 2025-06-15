import { Post } from '@prisma/client';
import { BaseRepository } from './baserepostiory';

export class PostRepository extends BaseRepository<Post> {
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
