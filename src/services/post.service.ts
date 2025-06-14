import { Post, PrismaClient } from '@prisma/client';

import { PostRepository } from '../Repositories/post.repostiory';
import { CreatePostData, UpdatePostData } from '../Dtos/post.dto';
import { LoggerUtility } from '../Utilities/LoggerUtility';

export class PostService {
  private postRepository: PostRepository;
  private logger: LoggerUtility;
  private prisma: PrismaClient = new PrismaClient();

  constructor() {
    this.postRepository = new PostRepository();
    this.logger = new LoggerUtility(this.prisma);
  }

  async createpost(data: CreatePostData): Promise<Post> {
    let result = await this.postRepository.create(data);
    this.logger.info('user post created');
    return result;
  }

  async getAllposts(): Promise<Post[]> {
    // let result = await this.postRepository.findbyQuery({userId : 10});
    let result = await this.postRepository.findAll();
    return result;
  }

  async getpostById(id: number): Promise<Post | null> {
    let result = await this.postRepository.findById(id);
    return result;
  }

  async updatepost(id: number, data: UpdatePostData) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('post not found');
    }

    let result = await this.postRepository.update(id, data);
    return result;
  }

  async deletepost(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('post not found');
    }

    let result = await this.postRepository.delete(id);
    return result;
  }
}
