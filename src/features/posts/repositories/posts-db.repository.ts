import { Post } from '../types/post.type';
import { PostInputModelDto } from '../dto/posts.input-model.dto';
import { WithId, ObjectId } from 'mongodb';
import { blogCollection, postCollection } from '../../../db/mongo.db';


export const postsRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postCollection.find({}).toArray();
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    if (!ObjectId.isValid(id)) return null;
    return postCollection.findOne({ _id: new ObjectId(id) });
  },
   async findByBlogId(blogId: string): Promise<WithId<Post>[]> {
    if (!ObjectId.isValid(blogId)) return [];
    return postCollection.find({ blogId: blogId }).toArray();
  },
  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { _id: insertResult.insertedId, ...newPost };
  },

  async update(id: string, dto: PostInputModelDto): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    if (updateResult.modifiedCount < 1) {
      return false;
    }
    return true;
  },

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const deleteResult = await postCollection.deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount < 1) {
      return false;
    }
    return true;
  },
};