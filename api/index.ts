import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { setupApp } from '../src/set-app';
import { connectToDb } from '../src/db/mongo.db';

const app = express();
setupApp(app);

// singleton-подключение для serverless
let dbReady: Promise<void> | null = null;

const ensureDb = () => {
  if (!dbReady) {
    const MONGO_URI = process.env.MONGO_URI;
    const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

    if (!MONGO_URI) throw new Error('MONGO_URI is not defined');
    if (!MONGO_DB_NAME) throw new Error('MONGO_DB_NAME is not defined');

    dbReady = connectToDb(MONGO_URI, MONGO_DB_NAME);
  }
  return dbReady;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDb();
  return (app as any)(req, res);
}
