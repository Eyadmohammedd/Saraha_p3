import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";
import { UserModel } from "./model/user.model.js";
export const connectDB = async () => {
  try {
    const result = await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("Database connected successfully");
    await UserModel.syncIndexes();
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
