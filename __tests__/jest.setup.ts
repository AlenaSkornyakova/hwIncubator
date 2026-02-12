import { connectToDb, stopDb } from '../src/db/mongo.db';

beforeAll(async () => {
  await connectToDb(
    process.env.MONGO_URI!,
    process.env.MONGO_DB_NAME_TEST!,
  );
});

afterAll(async () => {
  await stopDb();
});