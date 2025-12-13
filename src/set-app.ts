import express, { Request, Response } from 'express';
import { videosRouter } from './videos/routers/videos.router';
import { db } from './db/in-memory.db';
import { testsRouter } from './testing/routers/testing.router';

export const app = express();

app.use(express.json());

export const routerPath = {
  videos: '/videos',
  testing: '/testing',
};

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello back-end HomeWorks in it-incubator!!!');
});
app.use(routerPath.videos, videosRouter(db));
app.use(routerPath.testing, testsRouter(db));