const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID, // 카카오에서 발급해주는 아이디, 아이디를 발급받아 .env 파일에 넣어줌
        callbackURL: '/auth/kakao/callback', // 카카오로부터 인증 결과를 받을 라우터 주소
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao pofile', profile);
        try {
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'kakao'}, // 기존 회원 조회
            });
            if (exUser) { // 
                done(null, exUser); // 유저 정보 넘기기
            } else {
                const newUser = await User.create({ // 회원가입 진행
                    email: profile._json?.kako_account?.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser); // 데이터 유저 정보 넘기기
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
