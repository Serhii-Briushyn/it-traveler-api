import {
  JsonController,
  Get,
  Authorized,
  CurrentUser,
  Post,
  Param,
  Put,
  Delete,
  OnUndefined,
  UseBefore,
  Req,
} from "routing-controllers";
import { plainToInstance } from "class-transformer";
import { Request } from "express";
import { validate } from "class-validator";
import { MarkerService } from "./marker.service";
import { mapCreateMarkerDto, mapUpdateMarkerDto } from "./marker.mapper";
import { CreateMarkerDto, UpdateMarkerDto } from "./marker.dto";
import { ApiResponse } from "../../shared/api-response";
import { IUser } from "../../types/user.types";
import { IMarker } from "../../types/marker.types";
import { ApiError } from "../../shared/api-error";
import { saveFileToCloudinary } from "../../utils/cloudinary";
import { imageUploadMiddleware } from "../../middlewares/image-upload";

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
    return new ApiResponse(
      true,
      200,
      "Markers retrieved successfully",
      markers,
    );
  }

  // ─────────────────── Create ───────────────────

  @Post()
  @Authorized()
  @UseBefore(imageUploadMiddleware)
  async create(
    @CurrentUser() user: IUser,
    @Req() req: Request,
  ): Promise<ApiResponse<IMarker>> {
    const file = req.file;
    const dto = plainToInstance(CreateMarkerDto, req.body);

    if (file) {
      dto.imageUrl = await saveFileToCloudinary(file);
    }

    const validateError = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validateError.length > 0)
      throw new ApiError(
        400,
        "Invalid request body",
        "VALIDATION_ERROR",
        validateError,
      );

    const markerData = mapCreateMarkerDto(dto);
    const marker = await this.service.create(markerData, user.id);
    return new ApiResponse(true, 201, "Marker created successfully", marker);
  }

  // ─────────────────── Update ───────────────────

  @Put("/:id")
  @Authorized()
  @UseBefore(imageUploadMiddleware)
  async update(
    @CurrentUser() user: IUser,
    @Param("id") id: string,
    @Req() req: Request,
  ): Promise<ApiResponse<IMarker>> {
    const file = req.file;
    const dto = plainToInstance(UpdateMarkerDto, req.body);

    if (file) {
      dto.imageUrl = await saveFileToCloudinary(file);
    }

    const validateError = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validateError.length > 0)
      throw new ApiError(
        400,
        "Invalid request body",
        "VALIDATION_ERROR",
        validateError,
      );

    const updatedData = mapUpdateMarkerDto(dto);
    const updated = await this.service.update(id, user.id, updatedData);
    return new ApiResponse(true, 200, "Marker updated successfully", updated);
  }

  // ─────────────────── Delete ───────────────────

  @Delete("/:id")
  @Authorized()
  @OnUndefined(204)
  async delete(
    @CurrentUser() user: IUser,
    @Param("id") id: string,
  ): Promise<void> {
    await this.service.delete(id, user.id);
  }
}
