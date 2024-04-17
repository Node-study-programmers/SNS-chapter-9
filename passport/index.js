const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    // 로그인 할때 만 실행
    // req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
    // 사용자 정보 객체에서 아이디만 추려 세션에 저장
    passport.serializeUser((user, done) => {
        done(null, user.id); // done(에러발생할 때 사용, 저장하고 싶은 데이터)
    });

    // 각 요청마다 실행
    // serializeUser의 함수 done (__, 저장하고 싶은 데이터) 두번쨰 데이터인 user.id가 deserializeUser의 매개변수가 됨
    // 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴
    passport.deserializeUser((id, done) => {
        User.findOne({  // 데이터베이스에서 사용자 정보 조회
            where: {id},
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
        })
            .then(user => done(null, user)) // 조회한 정보를 req.user에 저장, 앞으로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있음
            .catch(err => done(err));
    });

    // 위 뒤 함수는 세션에 불필요한 데이터를 담아두지 않기 위한 과정

    local();
    kakao();
};