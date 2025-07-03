import { Post } from '@prisma/client';
import { PostRepository } from '../repositories/post.repostiory';
import { CreatePostData, UpdatePostData } from '@/Dtos/post.dto';
import { NotFoundError } from '../Utilities/ErrorUtility';

/**
 * Service for post-related business logic.
 * Handles creation, retrieval, update, and deletion of posts.
 */
export class PostService {
  private postRepository: PostRepository;

  /**
   * Initializes the PostService and its PostRepository dependency.
   */
  constructor() {
    this.postRepository = new PostRepository();
  }

  /**
   * Creates a new post.
   * @param data Data for the new post
   * @returns The created Post object
   */
  async createpost(data: CreatePostData): Promise<Post> {
    const result = await this.postRepository.insert({
      ...data,
      userId: String(data.userId),
    });
    return result;
  }

  /**
   * Retrieves all posts.
   * @returns Array of Post objects
   */
  async getAllposts(): Promise<Post[]> {
    // let result = await this.postRepository.findbyQuery({userId : 10});

    const result = await this.postRepository.findAll();
    return result;
  }

  /**
   * Retrieves a post by its ID.
   * @param id Post ID
   * @returns The Post object or null if not found
   */
  async getpostById(id: number): Promise<Post | null> {
    const result = await this.postRepository.findById(id);
    return result;
  }

  /**
   * Updates a post by its ID.
   * @param id Post ID
   * @param data Data to update the post
   * @returns The updated Post object
   * @throws NotFoundError if post is not found
   */
  async updatepost(id: number, data: UpdatePostData): Promise<Post> {
    const post = await this.postRepository.update({ id }, data);
    if (!post) {
      throw new NotFoundError('post not found');
    }
    return post;

    // const result = await this.postRepository.update(id, data);
    // return result;
  }

  /**
   * Deletes a post by its ID.
   * @param id Post ID
   * @returns The deleted Post object
   * @throws Error if post is not found
   */
  async deletepost(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('post not found');
    }

    const result = await this.postRepository.delete(id);
    return result;
  }
}
