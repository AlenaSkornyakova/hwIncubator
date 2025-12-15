import express from 'express';
import { db } from '../../db/in-memory.db';
import { HTTP_STATUSES } from '../../core/utils/http-status';


 export const testsRouter = express.Router();

  testsRouter.delete('/all-data', (req, res) => {
    db.blogs = [];
    db.posts = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });


