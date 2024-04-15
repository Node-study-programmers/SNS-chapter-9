const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};
const sequelize = new Sequelize (
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
const basename = path.basename(__filename); // basename == index.js
fs
  .readdirSync(__dirname) // 현재 디렉토리에서 파일 목록을 동기적으로 읽어옴
  .filter(file => { // 파일 목록 필터링
    // 파일 이름의 첫 번째 문자가 .이 아닌 경우,
    // 현재 파일을 제외한 나머지 파일
    // 파일 이름의 끝 세 글자가 .js인 경우
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => { // 선택된 각 파일에 대해 순회하면서 Sequelize 모델을 초기화하고 관계 설정
    const model = require(path.join(__dirname, file)); // ex) user
    console.log(file, model.name); // User
    db[model.name] = model; // 불러온 모델을 db 객체에 할당
    model.initiate(sequelize); // 모델 초기화
  });

Object.keys(db).forEach(modelName => {
  if(db[modelName].associate) { // associate() 메서드 확인
    db[modelName].associate(db); // 관계 정의
  }
});

module.exports = db;

// const Sequelize = require('sequelize');
// const User = require('./user');
// const Post = require('./post');
// const Hashtag = require('./hashtag');
// const env = process.env.NODE_ENV || 'development';
// const config = require('../config/config')[env];

// // DB 빈 객체 생성
// const db = {};

// // Sequelize 인스턴스를 생성하고 데이터베이스와의 연결 설정
// const sequelize = new Sequelize(
//   config.database, config.username, config.password, config,
// );

// // 각 모델과 Sequelize 인스턴스를 db객체에 할당
// db.sequelize = sequelize;
// db.User = User;
// db.Post = Post;
// db.Hashtag = Hashtag;

// // 각 모델의 초기화 메서드를 호출하여 데이터베이스 모델을 초기화
// User.initiate(sequelize);
// Post.initiate(sequelize);
// Hashtag.initiate(sequelize);

// // 각 모델의 관계 설정 메서드를 호출하여 모델 간의 관계를 설정
// User.associate(db);
// Post.associate(db);
// Hashtag.associate(db);

// module.exports = db;