import { User } from "../../domain/user.type";
import { UserOutput } from "../../api/output/user.output";
import { WithId } from "mongodb";

export const mapToUserOutput = (user: WithId<User>): UserOutput => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};