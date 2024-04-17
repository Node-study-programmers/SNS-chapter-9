const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

const join = async (req, res, next) => {
    const {email, nick, password} = req.body;
    try {
        const exUser = await User.findOne({ where: {email} }); // findOne : 단일 레코드 검색에 사용
        if (exUser) { // 사용 중인 이메일
            return res.redirect('/join?error=exist'); // /join으로 리디렉션하고, 쿼리 문자열로 error=exist 에러코드 전달
        }

        // 회원가입 시 비밀번호 암호화 저장
        const hash = await bcrypt.hash(password, 12); // 사용자의 비밀번호를 해싱하는 메서드, 12는 salt의 길이
        await User.create({ // 데이터베이스에 새로운 사용자를 생성하는 메서드
            email,
            nick,
            password: hash,
        });
        return res.redirect('/'); // 회원가입 성공 시 홈페이지로..
    } catch(error) {
        console.error(error);
        return next(error);
    }
};

const login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => { // 로컬 인증 수행 및 결과 처리
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }

        // req.login은 passport에서 제공하는 메서드, 사용자 로그인을 위해 세션에 사용자 정보 저장
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            return res.redirect('/');
        });
    })(req, res, next);
};

const logout = (req, res) => {
    // req.logout은 passport에서 제공하는 메서드, 현재 로그인된 사용자를 로그아웃
    req.logout(() => { // req.user객체와 req.session 객체를 제거
        res.redirect('/');
    })
}

module.exports = {
    join,
    login,
    logout
};