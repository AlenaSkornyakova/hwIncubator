import express from 'express';
import { HTTP_STATUSES } from '../../core/utils/http-status';
import { blogCollection, postCollection, userCollection } from '../../db/mongo.db';


export const testsRouter = express.Router();

testsRouter.delete('/all-data', async (req, res) => {
    await blogCollection.deleteMany({});
    await postCollection.deleteMany({});
    await userCollection.deleteMany({});
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
