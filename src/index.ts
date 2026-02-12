import 'dotenv/config';
import express from 'express';
import { setupApp } from './set-app';
import { connectToDb } from './db/mongo.db';

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  const PORT = process.env.PORT;
  const MONGO_URI = process.env.MONGO_URI;
  const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

  if (!PORT) throw new Error('PORT is not defined');
  if (!MONGO_URI) throw new Error('MONGO_URI is not defined');
  if (!MONGO_DB_NAME) throw new Error('MONGO_DB_NAME is not defined');

  await connectToDb(MONGO_URI, MONGO_DB_NAME);

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

bootstrap();
