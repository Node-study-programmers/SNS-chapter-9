import { NextFunction, Request, Response } from 'express';

class authValidator {
  static isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) return next();

    res.status(403).send('로그인 필요');
  }

  static isNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) return next();

    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
}

export default authValidator;
