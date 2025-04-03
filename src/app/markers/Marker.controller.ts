import {
  JsonController,
  Get,
  Authorized,
  CurrentUser,
  Post,
  Body,
  Param,
  Put,
  Delete,
  OnUndefined,
} from "routing-controllers";
import { MarkerService } from "./Marker.service";
import { ApiResponse } from "shared/ApiResponse";
import { IUser } from "types/user.types";
import { CreateMarkerDto, UpdateMarkerDto } from "./Marker.dto";
import { IMarker } from "types/marker.types";
import { validate } from "class-validator";
import { ApiError } from "shared/ApiError";
import { Types } from "mongoose";

@JsonController("/markers")
export class MarkerController {
  private service = new MarkerService();

  // ─────────────────── Get All ───────────────────

  @Authorized()
  @Get()
  async getAllByUser(
    @CurrentUser() user: IUser,
  ): Promise<ApiResponse<IMarker[]>> {
    const markers = await this.service.getAllMarkersByUser(user.id);
    return new ApiResponse(true, 200, "User markers retrieved", markers);
  }

  // ─────────────────── Create ───────────────────

  @Authorized()
  @Post()
  async create(
    @CurrentUser() user: IUser,
    @Body() body: CreateMarkerDto,
  ): Promise<ApiResponse<IMarker>> {
    const errors = await validate(body);
    if (errors.length > 0) {
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR", errors);
    }
    const marker = await this.service.create(body, user.id);
    return new ApiResponse(true, 201, "Marker created", marker);
  }

  // ─────────────────── Update ───────────────────

  @Put("/:id")
  async update(
    @CurrentUser() user: IUser,
    @Param("id") id: string,
    @Body() body: UpdateMarkerDto,
  ): Promise<ApiResponse<IMarker>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid marker ID", "INVALID_MARKER_ID");
    }

    const errors = await validate(body);
    if (errors.length > 0) {
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR", errors);
    }

    const updated = await this.service.update(id, user.id, body);
    return new ApiResponse(true, 200, "Marker updated", updated);
  }

  // ─────────────────── Delete ───────────────────

  @Authorized()
  @Delete("/:id")
  @OnUndefined(204)
  async delete(
    @CurrentUser() user: IUser,
    @Param("id") id: string,
  ): Promise<void> {
    await this.service.delete(id, user.id);
  }
}
