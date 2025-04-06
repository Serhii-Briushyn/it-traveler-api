import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuthPayload, IAuthResponse } from "./auth.types1";
import { env } from "../../utils/env";
import { UsersCollection } from "../../models/user.model1";
import { ApiError } from "../../shared/api-error";
import { SessionsCollection } from "../../models/session.model1";

export class AuthService {
  private generateAccessToken(userId: string): string {
    return jwt.sign({ id: userId }, env("JWT_SECRET"), { expiresIn: "1h" });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, env("JWT_REFRESH_SECRET"), {
      expiresIn: "7d",
    });
  }

  public createSession(userId: string) {
    const now = Date.now();
    return {
      userId,
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
      accessTokenValidUntil: new Date(now + 60 * 60 * 1000),
      refreshTokenValidUntil: new Date(now + 7 * 24 * 60 * 60 * 1000),
    };
  }

  // ─────────────────── Register ───────────────────

  async register(payload: IAuthPayload): Promise<IAuthResponse> {
    const existingUser = await UsersCollection.findOne({
      email: payload.email,
    });
    if (existingUser)
      throw new ApiError(
        409,
        "User with this email already exists",
        "USER_EXISTS",
      );

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const createdUser = await UsersCollection.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    });

    const userId = createdUser.id;
    const session = await SessionsCollection.create(this.createSession(userId));

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  // ─────────────────── Login ───────────────────

  async login(payload: IAuthPayload): Promise<IAuthResponse> {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) throw new ApiError(404, "User not found", "USER_NOT_FOUND");

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new ApiError(
        401,
        "Email or password is incorrect",
        "INVALID_CREDENTIALS",
      );

    const userId = user.id;
    await SessionsCollection.deleteOne({ userId });

    const session = await SessionsCollection.create(this.createSession(userId));

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  // ─────────────────── Logout ───────────────────

  async logout(userId: string) {
    await SessionsCollection.deleteOne({ userId });
  }

  // ─────────────────── Refresh ───────────────────

  async refresh(refreshToken: string): Promise<IAuthResponse> {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required", "TOKEN_REQUIRED");
    }

    let decoded: { id: string };

    try {
      decoded = jwt.verify(refreshToken, env("JWT_REFRESH_SECRET")) as {
        id: string;
      };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Token expired", "TOKEN_EXPIRED");
      }

      if (error.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid token", "INVALID_TOKEN");
      }

      throw error;
    }

    const session = await SessionsCollection.findOne({ refreshToken });
    if (!session) {
      throw new ApiError(401, "Session not found", "SESSION_NOT_FOUND");
    }

    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) {
      throw new ApiError(401, "Session expired", "SESSION_EXPIRED");
    }

    const user = await UsersCollection.findById(decoded.id);
    if (!user) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }

    await SessionsCollection.deleteOne({ _id: session._id });

    const newSession = await SessionsCollection.create(
      this.createSession(user.id),
    );

    return {
      accessToken: newSession.accessToken,
      refreshToken: newSession.refreshToken,
    };
  }
}
