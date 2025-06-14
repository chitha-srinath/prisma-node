import { Request, Response } from 'express';
import { PostService } from '../services/post.service';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async createpost(req: Request, res: Response) {
    try {
      const post = await this.postService.createpost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async getAllposts(_req: Request, res: Response) {
    try {
      const posts = await this.postService.getAllposts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getpostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await this.postService.getpostById(Number(id));
      if (!post) {
        res.status(404).json({ message: 'post not found' });
        return;
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async updatepost(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = req.body;
      const post = await this.postService.updatepost(Number(id), data);
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async deletepost(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.postService.deletepost(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
