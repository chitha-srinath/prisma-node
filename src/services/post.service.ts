import { Post } from '@prisma/client';

import { PostRepository } from '../repositories/post.repostiory';
import { CreatePostData, UpdatePostData } from '../interface/post';

export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  async createpost(data: CreatePostData): Promise<Post> {
    const result = await this.postRepository.insert(data);
    return result;
  }

  async getAllposts(): Promise<Post[]> {
    // let result = await this.postRepository.findbyQuery({userId : 10});
    const result = await this.postRepository.findAll();
    return result;
  }

  async getpostById(id: number): Promise<Post | null> {
    const result = await this.postRepository.findById(id);
    return result;
  }

  async updatepost(id: number, data: UpdatePostData) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('post not found');
    }

    const result = await this.postRepository.update(id, data);
    return result;
  }

  async deletepost(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('post not found');
    }

    const result = await this.postRepository.delete(id);
    return result;
  }
}
