import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../sequelize/models/User.js';

export default () => {
  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const exUser: any = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);

            result ? done(null, exUser) : done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            return;
          }
          done(null, false, { message: '가입되지 않은 회원입니다.' });
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
