import jwt from "jsonwebtoken";
import { env } from "utils/env";
import { UsersCollection } from "models/user.model";
import { SessionsCollection } from "models/session.model";
import { ApiError } from "shared/api-error";

export const verifyToken = async (token: string) => {
  const decoded = jwt.verify(token, env("JWT_SECRET")) as { id: string };

  const userDoc = await UsersCollection.findById(decoded.id);
  if (!userDoc) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const session = await SessionsCollection.findOne({
    accessToken: token,
  }).lean();
  if (!session) {
    throw new ApiError(401, "Session not found", "SESSION_NOT_FOUND");
  }

  const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isExpired) {
    throw new ApiError(401, "Session expired", "SESSION_EXPIRED");
  }

  return userDoc.toJSON();
};
