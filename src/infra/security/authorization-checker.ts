import { Action } from "routing-controllers";
import { ApiError } from "shared/api-error";
import { verifyToken } from "./verify-token";

export const authorizationChecker = async (
  action: Action,
): Promise<boolean> => {
  const authHeader = action.request.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "Authorization header is missing or invalid",
      "INVALID_AUTH_HEADER",
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await verifyToken(token);
    action.request.user = user;
    return true;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired", "TOKEN_EXPIRED");
    }

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token", "INVALID_TOKEN");
    }
    throw error;
  }
};
