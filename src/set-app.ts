import express, { Express } from 'express';
import { postsRouter } from './features/posts/routers/posts.router';
import { blogsRouter } from './features/blogs/routers/blogs.router';
import { testsRouter } from './testing/routers/testing.router';
import { routerPath } from './core/paths/paths';

export const setupApp = (app: Express) => {
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(routerPath.posts, postsRouter);
app.use(routerPath.blogs, blogsRouter);
app.use(routerPath.testing, testsRouter);

  return app;
} 