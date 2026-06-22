import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';

import { postsRouter } from './features/posts/api/posts.route';
import { blogsRouter } from './features/blogs/api/blogs.route';
import { testsRouter } from './testing/routers/testing.router';
import { routerPath } from './core/paths/paths';
import { usersRouter } from './features/users/api/users.rout';
import { authRouter } from './auth/api/auth.router';

export const setupApp = (app: Application) => {
  app.use(express.json());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  app.use(routerPath.posts, postsRouter);
  app.use(routerPath.blogs, blogsRouter);
  app.use(routerPath.testing, testsRouter);
  app.use(routerPath.users, usersRouter);
  app.use(routerPath.auth, authRouter);

  return app;
};