import { NextFunction, Request, Response } from 'express';

class RouteError {
  static renderError(err: Error, req: Request, res: Response, next: NextFunction) {
    res.locals.message = err.message;
    res.status(404).render('error');
  }
  static notFoundHandler(req: Request, res: Response, next: NextFunction) {
    const err = new Error('존재하지 않는 라우터');
    next(err);
  }
}

export default RouteError;
