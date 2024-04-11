import express from 'express';
import PageController from '../controller/pageController.js';

const pageRouter = express.Router();

pageRouter.use(PageController.startPoint);

pageRouter.get('/', PageController.renderMain);
pageRouter.get('/profile', PageController.renderProfile);
pageRouter.get('/join', PageController.renderJoin);

export default pageRouter;
