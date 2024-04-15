const Sequelize = require('sequelize');

// Sequelize.Model 클래스를 상속받는 User 클래스를 정의
class User extends Sequelize.Model {
    static initiate(sequelize) { // 데이터베이스 모델 초기화
        User.init({ // 모델 정의
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'), // 두 값중 하나만 가질수 있음
                allowNull: false,
                defaultValue: 'local',
            },
            snsid: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize, // 모델과 데이터베이스 간의 연결 설정
            timestamps: true, // 생성 및 수정 시간 기록
            underscored: false, // 테이블의 컬럼명을 스네이크 케이스로 저장할지 여부 지정, 기본값은 false이며, 카멜 케이스 (스네이크? 카멜?)
            modeNmae: 'User', // 모델의 이름을 지정, Sequelize가 해당 이름을 사용하여 모델 식별, Default는 클래스 이름
            tableName: 'users', // 테이블 이름
            paranoide: true, // 논리적 삭제를 활성화할지 여부 지정 (?)
            charset: 'utf8', // 문자셋
            collate: 'utf8_general_ci', // 정렬 순서
        })
    }

    static associate(db) { // 모델 간의 관계를 설정하는 정적 메서드
        db.User.hasMany(db.Post); // 1:N 
        db.User.belongsToMany(db.User, { // N:M
            foreignKey: 'followingId', // 외래키 이름 설정
            as: 'Followers', // 별칭 사용
            through: 'Follow' // 관계를 저장하는 중간 테이블의 이름을 설정
        });
        db.User.belongsToMany(db.User, { // 위와 동일하지만 외래 키와 별칭이 다름
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    } 
};

module.exports = User;