import express, { Request, Response } from 'express';
import { videosRouter } from './videos/routers/videos.router';
import { db } from './db/in-memory.db';

export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello back-end HomeWorks in it-incubator!!!');
});
app.use('/videos', videosRouter(db));
