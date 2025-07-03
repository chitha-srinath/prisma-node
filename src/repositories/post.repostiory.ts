import { Post, Prisma } from '@prisma/client';
import { BaseRepository } from './baserepository';
import { PrismaClient } from '@prisma/client';

/**
 * Repository for Post entity, extends the generic BaseRepository.
 */
export class PostRepository extends BaseRepository<
  Post,
  Prisma.PostCreateInput,
  Prisma.PostUpdateInput,
  Prisma.PostWhereInput,
  Prisma.PostWhereUniqueInput,
  PrismaClient['post']
> {
  /**
   * Initializes the PostRepository with the Prisma post model.
   */
  constructor() {
    super((prisma: PrismaClient) => prisma.post);
  }

  /**
   * Finds posts matching a query.
   * @param matchQuery Partial query object for filtering posts
   * @returns Array of Post objects matching the query
   */
  async findbyQuery(matchQuery: Partial<Post>): Promise<Post[]> {
    const result = await this.getModel().findMany({
      where: matchQuery,
    });
    return result;
  }
}
