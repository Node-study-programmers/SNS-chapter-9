import Sequelize from 'sequelize';

export interface MyModel extends Sequelize.Model {
  initiate(sequelize: Sequelize.Sequelize): void;
  associate(): void;
}
