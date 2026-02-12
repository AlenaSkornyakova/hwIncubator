import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../features/blogs/types/blog.type';
import { Post } from '../features/posts/types/post.type';

const BLOG_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let client: MongoClient;

export async function connectToDb(url: string, dbName: string): Promise<void> {
  client = new MongoClient(url);

  try {
    await client.connect();
    const db: Db = client.db(dbName);
    blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);

    await db.command({ ping: 1 });
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
