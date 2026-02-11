import { BlogInputModelDto } from '../dto/blogs.input-model.dto';
import { blogCollection } from '../../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { Blog } from '../types/blog.type';


export const blogsRepository = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogCollection.find({}).toArray();
  },

  async findById(id: string): Promise<WithId<Blog> | null> {
    if (!ObjectId.isValid(id)) return null;
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return { _id: insertResult.insertedId, ...newBlog };
  },

  async updateById(id: string, dto: BlogInputModelDto): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;

    const updateResult = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );
    return updateResult.matchedCount === 1;
  },

  async deleteById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const deleteResult = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount === 1;
  },
};
