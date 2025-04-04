import {
  JsonController,
  Post,
  Body,
  CurrentUser,
  Authorized,
  HttpCode,
} from "routing-controllers";
import { validate } from "class-validator";

import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./auth.dto";
import { ApiResponse } from "shared/api-response";
import { ApiError } from "shared/api-error";
import type { IAuthResponse } from "./auth.types";
import { IUser } from "types/user.types";

@JsonController("/auth")
export class AuthController {
  private service = new AuthService();

  // ─────────────────── Register ───────────────────

  @Post("/register")
  async register(
    @Body() body: RegisterDto,
  ): Promise<ApiResponse<IAuthResponse>> {
    const errors = await validate(body);
    if (errors.length > 0) {
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR", errors);
    }

    const result = await this.service.register(body);
    return new ApiResponse(true, 201, "Registration successful", result);
  }

  // ─────────────────── Login ───────────────────

  @Post("/login")
  async login(@Body() body: LoginDto): Promise<ApiResponse<IAuthResponse>> {
    const errors = await validate(body);
    if (errors.length > 0) {
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR", errors);
    }

    const result = await this.service.login(body);
    return new ApiResponse(true, 200, "Login successful", result);
  }

  // ─────────────────── Logout ───────────────────

  @Authorized()
  @HttpCode(204)
  @Post("/logout")
  async logout(@CurrentUser() user: IUser) {
    await this.service.logout(user.id);
    return null;
  }

  // ─────────────────── Refresh ───────────────────

  @Post("/refresh")
  async refresh(
    @Body() body: { refreshToken: string },
  ): Promise<ApiResponse<IAuthResponse>> {
    const result = await this.service.refresh(body.refreshToken);
    return new ApiResponse(true, 200, "Token refreshed successfully", result);
  }
}
