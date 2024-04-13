import Sequelize from 'sequelize';
import User from './User.js';
import Hashtag from './HashTag.js';

class Post extends Sequelize.Model {
  static initiate(sequelize: Sequelize.Sequelize) {
    Post.init(
      {
        content: { type: Sequelize.STRING(140), allowNull: false },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate() {
    Post.belongsTo(User);
    Post.belongsToMany(Hashtag, { through: 'PostHashtag' });
  }
}

export default Post;
