import express, { Request, Response } from 'express';
import { postsRouter } from './features/posts/routers/posts.router';
import { blogsRouter } from './features/blogs/routers/blogs.router';
import { testsRouter } from './testing/routers/testing.router';
import { routerPath } from './core/paths/paths';

export const app = express();

app.use(express.json());



app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello back-end HomeWorks in it-incubator!!!');
});
app.use(routerPath.posts, postsRouter);
app.use(routerPath.blogs, blogsRouter);
app.use(routerPath.testing, testsRouter);