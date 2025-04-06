import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "../types/user.types";

export interface UserDocument extends Omit<IUser, "id">, Document {
  _id: Types.ObjectId;
  toJSON(): Record<string, any>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const { _id, password, ...rest } = this.toObject();
  return {
    id: _id.toString(),
    ...rest,
  };
};

export const UsersCollection = model<UserDocument>("users", userSchema);
