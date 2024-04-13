import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import RouteError from './errors/routeError.js';
import pageRouter from './routers/pageRouter.js';
import conn from './sequelize/models/index.js';

dotenv.config();

const app = express();
const port = 5000;

app.set('view engine', 'html');
nunjucks.configure('src/views', {
  express: app,
  watch: true,
});

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || 'noKey',
    cookie: { httpOnly: true, secure: false },
  })
);

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(200);
});
app.use('/', pageRouter);
app.use(RouteError.notFoundHandler);
app.use(RouteError.renderError);

app.listen(port, async () => {
  await conn;
  console.log(`open Server port ${port}`);
});