const express = require('express');
const {renderProfile, renderJoin, renderMain} = require('../controllers/page');

// 라우터 생성
const router = express.Router();


// 모든 요청에 대해 공통적으로 실행되는 작업
// res.locals : 응답의 로컬 변수를 설정 및 초기화
// next() 함수를 호출하여 미들웨어로 제어를 전달
router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingList = [];
    next();
});

router.get('/profile', renderProfile);
router.get('/join', renderJoin);
router.get('/', renderMain);

module.exports = router;