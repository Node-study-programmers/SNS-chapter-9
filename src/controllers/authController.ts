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
    passport.authenticate('local', (authError: Error | null, user: User | null, info: any) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?error=${info.message}`);
      }
      return req.login(user, loginError => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
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
