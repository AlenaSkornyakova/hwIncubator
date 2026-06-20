import { ObjectId, WithId } from "mongodb";
import { User } from "../domain/user.type";
import { UserOutput } from "../api/output/user.output";
import { userCollection } from "../../../db/mongo.db";
import { mapToUserOutput } from "./mappers/map-user-output.util";


export const usersQwRepository = {

  async findById(id: string): Promise<UserOutput | null> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    return user ? mapToUserOutput(user) : null;
  },
};
