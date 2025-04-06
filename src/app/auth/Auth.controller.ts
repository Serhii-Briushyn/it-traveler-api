import {
  JsonController,
  Post,
  Body,
  CurrentUser,
  Authorized,
  OnUndefined,
  Get,
} from "routing-controllers";

import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./auth.dto";
import { ApiResponse } from "shared/api-response";
import type { IAuthResponse } from "./auth.types";
import { IUser } from "types/user.types";
import { ApiError } from "shared/api-error";
import { validate } from "class-validator";

@JsonController("/auth")
export class AuthController {
  private service = new AuthService();

  // ─────────────────── Register ───────────────────

  @Post("/register")
  async register(
    @Body() body: RegisterDto,
  ): Promise<ApiResponse<IAuthResponse>> {
    const validateError = await validate(body);

    if (validateError.length > 0) {
      throw new ApiError(
        400,
        "Invalid request body",
        "VALIDATION_ERROR",
        validateError,
      );
    }
    const result = await this.service.register(body);
    return new ApiResponse(true, 201, "Registration successful", result);
  }

  // ─────────────────── Login ───────────────────

  @Post("/login")
  async login(@Body() body: LoginDto): Promise<ApiResponse<IAuthResponse>> {
    const validateError = await validate(body);

    if (validateError.length > 0) {
      throw new ApiError(
        400,
        "Invalid request body",
        "VALIDATION_ERROR",
        validateError,
      );
    }
    const result = await this.service.login(body);
    return new ApiResponse(true, 200, "Login successful", result);
  }

  // ─────────────────── Logout ───────────────────

  @Authorized()
  @OnUndefined(204)
  @Post("/logout")
  async logout(@CurrentUser() user: IUser) {
    await this.service.logout(user.id);
  }

  // ─────────────────── Refresh ───────────────────

  @Post("/refresh")
  async refresh(
    @Body() body: { refreshToken: string },
  ): Promise<ApiResponse<IAuthResponse>> {
    const result = await this.service.refresh(body.refreshToken);
    return new ApiResponse(true, 200, "Token refreshed successfully", result);
  }

  // ─────────────────── GetMe ───────────────────

  @Authorized()
  @Get("/me")
  getMe(@CurrentUser() user: IUser): ApiResponse<IUser> {
    return new ApiResponse(true, 200, "User fetched successfully", user);
  }
}
