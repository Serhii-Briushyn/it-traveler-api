import jwt from "jsonwebtoken";
import { UsersCollection } from "models/user.model";
import { Action } from "routing-controllers";
import { env } from "utils/env";

export const currentUserChecker = async (action: Action) => {
  const authHeader = action.request.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env("JWT_SECRET")) as { id: string };
    const userDoc = await UsersCollection.findById(decoded.id).lean();
    if (!userDoc) return null;

    const user = {
      ...userDoc,
      id: userDoc._id.toString(),
    };

    return user;
  } catch {
    return null;
  }
};
