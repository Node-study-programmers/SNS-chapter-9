import express from 'express';
import authValidator from '../validators/authValidator.js';
import authController from '../controllers/authController.js';
import passport from 'passport';

const authRouter = express.Router();

authRouter.post('/join', authValidator.isNotLoggedIn, authController.join);

authRouter.post('/login', authValidator.isNotLoggedIn, authController.login);

authRouter.get('/logout', authValidator.isLoggedIn, authController.logout);

authRouter.get('/kakao', passport.authenticate('kakao'));

authRouter.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/?error=카카오로그인 실패',
  }),
  (req, res) => {
    res.redirect('/'); // 성공 시에는 /로 이동
  }
);
export default authRouter;
