import { NextFunction, Request, Response } from 'express';
import User from '../sequelize/models/User.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

class authController {
  static async join(req: Request, res: Response, next: NextFunction) {
    const { email, nick, password } = req.body;

    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        return res.redirect('/join?error=exist');
      }

      const hash = await bcrypt.hash(password, 12);
      await User.create({
        email,
        nick,
        password: hash,
      });
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  static login(req: Request, res: Response, next: NextFunction) {
    console.log('첫번째 : 로그인 미들웨어 들어옴');
    //authenticate 함수 실행시 로컬로그인 전략 함수가 먼저 실행됨
    passport.authenticate('local', (authError: Error | null, user: User | null, info: any) => {
      console.log('세번째 : authenticate 콜백 들어옴');
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?error=${info.message}`);
      }

      //login함수 실행시 passport.serializeUser함수가 먼저 실행되며 user 데이터 콜백으로 전달
      return req.login(user, loginError => {
        console.log('다섯번째 : 로그인 함수 콜백 실행');
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        console.log('여섯번째 : 로그인 완료');
        return res.redirect('/');
      });
    })(req, res, next); // ??
  }

  static logout(req: Request, res: Response) {
    req.logout(() => {
      res.redirect('/');
    });
  }
}

export default authController;
