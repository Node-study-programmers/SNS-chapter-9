const express = require('express'); // express 모듈
const cookieParser = require('cookie-parser'); // 쿠키 모듈 사용
const morgan = require('morgan'); // 디버깅에 사용되는 모듈
const path = require('path'); // 경로 작업 수행 ? 사용해야되나
const session = require('express-session'); // 세션 모듈 사용 -쿠키와..
const nunjucks = require('nunjucks'); // html에 사용
const dotenv = require('dotenv'); // .env 파일 사용

dotenv.config(); // .env파일을 이 파일에서 사용하겠다 !
// page 라우터 호출
const pageRouter = require('./routes/page');
// ./models/index.js 생략
// DB로그인, 테이블 생성, 관계 등이 이루어짐
const { sequelize } = require('./models');

// express 프레임워크를 사용하겠다 app이란 변수로
const app = express();

// app.set() == express 애플리케이션 설정
// express 애플리케이션의 포트를 .env폴더의 PORT로 하겠다 / default는 8001
app.set('port', process.env.PORT || 8001);

// express 애플리케이션에서 사용할 뷰 엔진 설정
// html 파일 확장자를 가진 파일을 뷰로 처리
app.set('view engine', 'html');

// Nunjucks 템플릿 엔진을 Express 애플리케이션에 설정하고 구성하는 역할
// nunjucks.configue(directory, options)
// 뷰 폴더의 템플릿 파일의 위치 지정
nunjucks.configure('views', {
    express: app, // express 애플리케이션을 지정, 이를통해 Nunjucks는 Express와 함께 사용될 것임을 알게 됨
    watch: true, // Nunjucks가 템플릿 파일을 감시하고 변경 사항을 실시간으로 반영할지 여부 결정
})

// sync() 메서드를 호출하여 데이터베이스와 모델 간의 동기화를 수행
// force: false 옵션을 전달하여 기존의 테이블을 변경하지 않고 새로운 테이블을 생성
// force: true 일시 기존의 테이블을 삭제하고 새로운 테이블을 생성
// require('./models/index.js') 호출할 때 테이블이 생성되는줄 알았는데
// sync()함수가 실행될 때 테이블이 생성됨
// sequelize 객체 자체만으론 아직 데이터를 담아두기만하고 DB를 생성하지 않은 단계
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

// app.use() express애플리케이션에 미들웨어를 추가
app.use(morgan('dev')); // 'dev'는 Morgan의 로깅 형식 중 하나 (디버깅)

// 정적 파일을 제공하기 위한 미들웨어를 추가하는 역할
// express.static : 미들웨어를 추가하면 Express 서버는 지정된 디렉토리에서 정적 파일을 제공할 수 있음
// path.join(__dirname, 'public') // 정적 파일이 위치한 디렉토리 지정,
// __dirname은 현재 스크립트 파일이 위치한 디렉토리를 나타냄
app.use(express.static(path.join(__dirname, 'public')));
// == app.use('/', express.static('public'));

// JSON 형식의 요청 바디를 파싱하는 미들웨어를 추가하는 역할
// 클라이언트로부터 전송된 JSON형식의 데이터를 파싱하여 JavaScript 객체로 변환
app.use(express.json());

// URL-encoded 형식의 요청 바디를 파싱하는 미들웨어 추가
// 클라이언트로부터 전송된 URL-encoded 형식의 데이터를 파싱하여 JavaScript 객체로 변환
// extended가 true면 Node.js의 'querystring' 라이브러리를 사용하여 URL-encoded 데이터를 분석하고
//            false면 Node.js의 내장된 'querystring' 모듈을 사용하여 URL-encoded 데이터를 분석
// 그럼 Node.js의 querystring 라이브러리와 Node.js의 내장된 'querystring' 모듈의 차이는 뭘까
// querystring 라이브러리 -> 배열이나 객체와 같은 복잡한 구조를 허용
//                          ex) 'foo=bar&abc=xyz' -> { foo: 'bar', abc: 'xyz'}
// 내장 querystring -> 배열이나 객체와 같은 복잡한 구조를 해석하지 않음, 단순한 키-값 쌍만 해석
//                          ex) 'foo=bar&abc=xyz' -> { 'foo': 'bar', 'abc': 'xyz'}
// 결론, 배열이나 객체와 같은 복잡한 구조해석 = querystring 라이브러리 { extended: true }
//       단순한 키-값 쌍 해석 = 내장 querystring { extended: false }
app.use(express.urlencoded({ extended: false}));

// 쿠키를 파싱하는 미들웨어 추가
// 전송된 쿠키를 파싱하여 요청 객체의 req.cookies 속성에 저장
// cookieParaser(secret) 'secret' : 쿠키를 서명하는데 사용되는 비밀 키
// 이를 통해 쿠키가 변조되었는지 여부를 확인
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 관리를 위한 미들웨어 추가, 세션을 관리하고 클라이언트의 세션 상태를 유지
app.use(session({
    resave: false, // 요청이 왔을 때 세션을 항상 저장할지 여부 결정
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부를 결정
    secret: process.env.COOKIE_SECRET, // 세션을 서명하는데 사용되는 비밀 키
    cookie: { // 세션 쿠키의 설정을 지정하는 객체
        httpOnly: true, // 클라이언트에게 JavaScript를 통해 쿠키에 접속할 수 있는 여부 결정, true면 접근 X
        secure: false // HTTPS 프로토콜을 통해서만 쿠키를 전송할지 여부를 결정, false면 HTTPS가 아닌 요청에서도 쿠키 전송
    }
}));

// 라우팅을 처리하기 위해 라우터를 추가하는 역할
// 모든 경로('/')에 대한 요청을 'pageRouter'라는 라우터에 전달
app.use('/', pageRouter);

// 404 오류를 처리하기 위한 미들웨어 추가
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error); // 오류 객체를 다음 미들웨어 함수로 전달.
});

// 앞선 미들웨어에서 발생한 오류를 처리하고 클라이언트에게 적절한 응답을 제공하는 역할
app.use((err, req, res, next) => {
    res.locals.message = err.message; // 오류 메세지를 locals 속성에 저장

    // 개발 환경에서만 오류 객체를 응답 객체의 'locals' 속성에 저장
    // 이렇게 하면 개발 환경에서는 오류에 대한 자세한 정보를 클라이언트에게 표시할 수 있음
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status||500); // 응답 코드 설정
    res.render('error'); // 오류 페이지를 랜더링하여 클라이언트에게 반환, 'error'라는 템플릿
    // 파일을 렌더링하여 클라이언트에게 오류 페이지를 제공
});

// 특정 포트에서 실행하고, 해당 포트에서의 연결을 수신 대기하는 역할, 서버로서 동작하게 됨
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});