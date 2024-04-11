import { NextFunction, Request, Response } from 'express';

class PageController {
  static startPoint(req: Request, res: Response, next: NextFunction) {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
  }
  static renderProfile(req: Request, res: Response) {
    res.render('profile', { title: '내 정보 - NodeBird' });
  }
  static renderJoin(req: Request, res: Response) {
    res.render('join', { title: '회원 가입 - NodeBird' });
  }
  static renderMain(req: Request, res: Response) {
    const twits: unknown[] = [];
    res.render('main', { title: 'NodeBird', twits });
  }
}

export default PageController;
