import { UserModel } from "../../DB/model/user.model.js";
import {
  findById,
  findOneAndUpdate,
} from "../../DB/database.repository.js";

export const getProfileService = async (userId) => {

  const user = await findById({
    id: userId,
    model: UserModel,
    select: "-password",
  });

  if (!user) throw new Error("User not found");

  return user;

};
export const deactivateAccountService = async (userId) => {

  const user = await findOneAndUpdate({
    filter: { _id: userId },
    update: { $set: { isActive: false } },
    model: UserModel,
    options: { returnDocument: "after" }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
export const updateProfilePictureService = async (userId, filePath) => {

  const user = await findOneAndUpdate({
    filter: { _id: userId },
    update: { $set: { profilePicture: filePath } },
    model: UserModel,
    options: { returnDocument: "after" }
  });

  return user;
};