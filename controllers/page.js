// res.render() : 뷰 템플릿을 렌더링하여 클라이언트에게 HTML 페이지를 반환하는 데 사용
// 'profile' : 템플릿 렌더링
// {title : '내정보 - NodeBird} : profile 템플릿에 데이터를 전달, 템플릿에서 'title' 변수를 사용할 수 있도록 함
// 랜더링된 HTML 페이지는 클라이언트에게 응답으로 전송

const { User, Post, Hashtag } = require('../models/index');

// 내 정보 페이지
const renderProfile = (req, res) => {
    res.render('profile', {title : '내정보 - NodeBird'});
};

// 회원 가입 페이지
const renderJoin = (req, res) => {
    res.render('join', {title : '회원가입 - NodeBird'});
};

// 메인 페이지
const renderMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({ // 게시글 조사
            include: {
                model: User,
                attributes: ['id', 'nick'], // 아이디 닉네임 제공
            },
            order: [['createdAt', 'DESC']], // 게시글 최신순
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts, // twits에 넣어 렌더링
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }

    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }

        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

module.exports = {
    renderProfile,
    renderJoin,
    renderMain,
    renderHashtag
};