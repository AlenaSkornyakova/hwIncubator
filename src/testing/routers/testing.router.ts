// src/routers/testing.router.ts
import { Request, Response } from 'express';
import express from 'express';
import type { DBType } from '../../db/in-memory.db';
import { HTTP_STATUSES } from '../../core/utils/http-status';

export const testsRouter = (db: DBType) => {
  const router = express.Router();

  router.delete('/all-data', (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });
  return router;
};
