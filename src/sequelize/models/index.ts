import { Sequelize } from 'sequelize';
import configs from '../config/config.js';
import dotenv from 'dotenv';
import { MyModel } from '../../types/types.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const PRODUCTION = process.env.PRODUCTION;
const config = PRODUCTION ? configs.production : configs.development;
const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  dialect: 'mysql',
});

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const basename = path.basename(__filename);

const files = fs.readdirSync(__dirname).filter(file => {
  // 숨김 파일, index.ts, ts 확장자가 아닌 파일 필터링
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts';
});

const models: Promise<MyModel | undefined>[] = files.map(async file => {
  const model: MyModel | undefined = await import(`../models/${file}`).then(data => data.default);
  //미완성 모델이라서 export하지 않은 파일 검증
  if (typeof model !== 'undefined') {
    model.initiate(sequelize);
    return model;
  }
});

//비동기 작업이 전부 완료된 후 연관 관계 설정
const conn = Promise.all(models).then(async models => {
  models.forEach(model => {
    if (model) model.associate();
  });

  await sequelize
    .sync({ force: false })
    .then(() => console.log('디비 연결 성공'))
    .catch(e => console.log(e));
});

export default conn;
