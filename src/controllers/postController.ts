import { NextFunction, Request, Response } from 'express';
import Post from '../sequelize/models/Post.js';
import Hashtag from '../sequelize/models/HashTag.js';

class PostController {
  static uploadImg(req: Request, res: Response, next: NextFunction) {
    //파일이 거부되어 존재하지 않을경우
    if (!req.file) return res.sendStatus(400);

    res.json({ url: `/upload-imgs/${req.file?.filename}` });
  }

  static async uploadPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await Post.create({ content: req.body.content, img: req.body.url, UserId: req.user?.id });
      const hashtags: string[] = req.body.content.match(/#[^\s#]*/g);
      if (hashtags) {
        const tags = hashtags.map(tag => {
          const tagName = tag.slice(1).toLowerCase();
          return Hashtag.findOrCreate({
            where: { title: tagName },
          });
        });
        const result = await Promise.all(tags);

        await post.addHashtags(result.map(r => r[0]));
      }
      res.redirect('/');
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default PostController;
