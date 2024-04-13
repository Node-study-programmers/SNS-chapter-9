import express from 'express';
import PageController from '../controllers/pageController.js';
import authValidator from '../validators/authValidator.js';

const pageRouter = express.Router();

pageRouter.use(PageController.startPoint);

pageRouter.get('/', PageController.renderMain);
pageRouter.get('/profile', authValidator.isLoggedIn, PageController.renderProfile);
pageRouter.get('/join', authValidator.isNotLoggedIn, PageController.renderJoin);

export default pageRouter;
