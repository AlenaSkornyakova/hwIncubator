import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../features/blogs/domain/blog.type';
import { Post } from '../features/posts/domain/post.type';
import { User } from '../features/users/domain/user.type';

const BLOG_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';

export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;

export let client: MongoClient;

export async function connectToDb(url: string, dbName: string): Promise<void> {
  client = new MongoClient(url);

  try {
    await client.connect();
    const db: Db = client.db(dbName);
    blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
    userCollection = db.collection<User>(USERS_COLLECTION_NAME);
    await db.command({ ping: 1 });

// Даже если два запроса пришли одновременно, если service не успел проверить. MongoDB всё равно не даст записать дубликат.
    // await userCollection.createIndex({ email: 1 }, { unique: true });
    // await userCollection.createIndex({ login: 1 }, { unique: true });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

// для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
