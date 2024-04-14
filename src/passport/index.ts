import passport from 'passport';
import local from './localStrategy.js';
import kakao from './kakaoStrategy.js';
import User from '../sequelize/models/User.js';

export default () => {
  /**
   * req.login(...) 실행시 serializeUser 함수실행(req.session객체에 passport 프로퍼티에 유저 데이터 저장)
   * 즉 로그인 할때만 실행
   * deserializeUser 함수에서 req.user 프로퍼티에 저장할 유저 정보를 조회할 수 있는 열쇠? 를 저장해주는 역할인듯
   */
  passport.serializeUser((user, done) => {
    console.log('네번째 : serializeUser 콜백 함수 들어옴');

    done(null, user.id); //로그인 전략(Strategy)에서 전달받은 user객체의 id값을 세션에 저장
  });

  /**
   * 모든 요청마다 serializeUser 함수에서 저장해준 유저 아이디를 통해 db조회 후
   * req.user 필드에 user정보 저장(나중에 넌적스 렌더링을 위해 res.locals.user에 할당 해야됨)
   */
  passport.deserializeUser((id, done) => {
    console.log('모든 요청 : deserializeUser 콜백 함수 들어옴');
    User.findOne({ where: { id } }) //id는 세션에서 가져옴
      .then(user => {
        done(null, user); //req.user 필드에 유저 정보 저장
      })
      .catch(err => done(err));
  });
  local();
  kakao();
};
