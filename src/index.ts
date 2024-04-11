import express from 'express';
import nunjucks from 'nunjucks';
const app = express();
const port = 5000;
app.set('view engine', 'html');
nunjucks.configure('src/views', {
  express: app,
  watch: true,
});

app.use(express.static('public'));

app.get('/', (req, res, next) => {
  res.render('main');
});

app.listen(port, () => {
  console.log(`open Server port ${port}`);
});
