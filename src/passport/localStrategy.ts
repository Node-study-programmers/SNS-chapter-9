import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../sequelize/models/User.js';

const local = () => {
  passport.use(
    new Strategy(
      {
        usernameField: 'email', //form 태그로 서버에 전송되는 필드명
        passwordField: 'password', //form 태그로 서버에 전송되는 필드명
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          console.log('두번째 : 로컬로그인 전략 콜백함수 들어옴');

          // 해당 시점에서 done함수는 passport.authenticate('local', callback)의 콜백으로 데이터 전달

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
        // 함수 실행 완료 후 passport.authenticate() 함수의 콜백으로 이동
      }
    )
  );
};

export default local;
