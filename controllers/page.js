// res.render() : 뷰 템플릿을 렌더링하여 클라이언트에게 HTML 페이지를 반환하는 데 사용
// 'profile' : 템플릿 렌더링
// {title : '내정보 - NodeBird} : profile 템플릿에 데이터를 전달, 템플릿에서 'title' 변수를 사용할 수 있도록 함
// 랜더링된 HTML 페이지는 클라이언트에게 응답으로 전송

// 내 정보 페이지
const renderProfile = (req, res) => {
    res.render('profile', {title : '내정보 - NodeBird'});
};

// 회원 가입 페이지
const renderJoin = (req, res) => {
    res.render('join', {title : '회원가입 - NodeBird'});
};

// 메인 페이지
const renderMain = (req, res) => {
    const twits = []; // 게시글 목록
    res.render('main', {title : 'NodeBird', twits});
};

module.exports = {
    renderProfile,
    renderJoin,
    renderMain
};