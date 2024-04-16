import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import authValidator from '../validators/authValidator.js';
import PostController from '../controllers/postController.js';

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload-imgs');
  },

  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + extName);
  },
});

const uploda = multer({
  storage: storageConfig,
  fileFilter: (req, file, cd) => {
    const mimetype = file.mimetype;
    //이미지 파일만 업로드 허용
    if (mimetype.includes('image')) {
      return cd(null, true);
    }
    //나머지 파일 거부
    cd(null, false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const postRouter = express.Router();

try {
  fs.readdirSync('public/upload-imgs');
} catch (error) {
  console.error('upload-imgs 폴더가 없어 upload-imgs 폴더를 생성합니다.');
  fs.mkdirSync('public/upload-imgs');
}

postRouter.post('/img', authValidator.isLoggedIn, uploda.single('img'), PostController.upload);

const upload2 = multer();
postRouter.post('/', authValidator.isLoggedIn, upload2.none(), (req, res, next) => {
  console.log(req.body);
});
export default postRouter;
