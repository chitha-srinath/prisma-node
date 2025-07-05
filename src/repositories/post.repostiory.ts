import { Post, Prisma } from '@prisma/client';
import { BaseRepository } from './baserepostiory';
import { PrismaClient } from '@prisma/client';

/**
 * Repository for Post entity operations.
 * Extends BaseRepository to provide type-safe database operations for Post model.
 * Handles all CRUD operations and advanced queries for post data.
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
   * Initializes the PostRepository with Prisma post model.
   * Sets up the repository to work with the Post entity in the database.
   */
  constructor() {
    super((prisma: PrismaClient) => prisma.post);
  }

  /**
   * Finds posts matching a partial query object.
   * Provides a convenient way to search posts using partial Post properties.
   * @param matchQuery Partial query object for filtering posts
   * @returns Promise resolving to an array of Post objects matching the query
   */
  async findbyQuery(matchQuery: Partial<Post>): Promise<Post[]> {
    return this.findAll(matchQuery as Prisma.PostWhereInput);
  }
}
