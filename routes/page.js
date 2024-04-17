const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const {renderProfile, renderJoin, renderMain, renderHashtag} = require('../controllers/page');

// 라우터 생성
const router = express.Router();

// 모든 요청에 대해 공통적으로 실행되는 작업
// res.locals : 응답의 로컬 변수를 설정 및 초기화
// next() 함수를 호출하여 미들웨어로 제어를 전달
router.use((req, res, next) => {
    res.locals.user = req.user; // ./passport/index.js에서 req에 user 데이터 넣어줬음
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingList = req.user?.Followings?.map(f => f.id) || [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile); // 로그인 확인 후 랜더링
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/hashtag', renderHashtag);

module.exports = router;