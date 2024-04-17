const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        // req.body 속성명을 적으면 됨 ( email, password )
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
    }, async(email, password, done) => { // done == passport.authenticate
        try {
            const exUser = await User.findOne({ where: {email} }); // 사용자 데이터베이스에서 일치하는 이메일 찾기
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password); // 비밀번호 비교
                if (result) {
                    done(null, exUser); // 사용자 정보를 넣어 보냄. passport.authenticate로
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }
))};