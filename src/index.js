import express from 'express';
import router from './router/indexRouter.js';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/', router);
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
}

);
