const express = require('express');
const passport = require('passport');

const {isLoggedIn, isNotLoggedIn} = require('../middlewares/index');
const {join, login, logout} = require('../controllers/auth');

const router = express.Router();

// 로그인 여부 체크 후 controller 진행
router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.get('/logout', isLoggedIn, logout);
router.get('/kakao', passport.authenticate('kakao')); // 카카오 로그인 요청 라우터
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오로그인 실패',
}), (req, res) => {
    res.redirect('/'); // 성공 시 홈페이지로 이동
})

module.exports = router;