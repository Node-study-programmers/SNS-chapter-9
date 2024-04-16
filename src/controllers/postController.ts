import { NextFunction, Request, Response } from 'express';

class PostController {
  static upload(req: Request, res: Response, next: NextFunction) {
    //파일이 거부되어 존재하지 않을경우
    if (!req.file) return res.sendStatus(400);

    res.json({ url: `/upload-imgs/${req.file?.filename}` });
  }
}

export default PostController;
