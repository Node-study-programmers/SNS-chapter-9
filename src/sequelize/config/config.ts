import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    username: 'root',
    password: process.env.DB_PWD,
    database: 'node_sns',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: undefined,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: undefined,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
