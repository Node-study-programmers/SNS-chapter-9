// 로그인 여부를 파악할 수 있는 메서드
// 회원 가입 라우터나 로그인 라우터는 로그인하지 않은 사람만 접근할 수 있게 해야함

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

const isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

module.exports = {
    isLoggedIn,
    isNotLoggedIn
};