import mongoose from "mongoose";
import { env } from "utils/env";

export const initMongoConnection = async () => {
  try {
    const user = env("MONGODB_USER");
    const password = env("MONGODB_PASSWORD");
    const url = env("MONGODB_URL");
    const dbName = env("MONGODB_DB");

    const uri = `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);

    console.log(`Connected to MongoDB database: ${dbName}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
