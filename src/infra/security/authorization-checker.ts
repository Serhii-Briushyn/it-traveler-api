import { UsersCollection } from "models/user.model";
import { Action } from "routing-controllers";
import jwt from "jsonwebtoken";
import { env } from "utils/env";

export const authorizationChecker = async (
  action: Action,
): Promise<boolean> => {
  const authHeader = action.request.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env("JWT_SECRET")) as { id: string };
    const user = await UsersCollection.findById(decoded.id).lean();
    return !!user;
  } catch {
    return false;
  }
};
