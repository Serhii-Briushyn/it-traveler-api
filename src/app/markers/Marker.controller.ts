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
  UseBefore,
  UploadedFile,
  Req,
} from "routing-controllers";
import { MarkerService } from "./marker.service";
import { ApiResponse } from "shared/api-response";
import { IUser } from "types/user.types";
import { CreateMarkerDto, UpdateMarkerDto } from "./marker.dto";
import { IMarker } from "types/marker.types";
import { validate } from "class-validator";
import { ApiError } from "shared/api-error";
import { saveFileToCloudinary } from "utils/cloudinary";
import { plainToInstance } from "class-transformer";
import { imageUploadMiddleware } from "middlewares/image-upload";
import { Request } from "express";
import { mapCreateMarkerDto, mapUpdateMarkerDto } from "./marker.mapper";

@JsonController("/markers")
export class MarkerController {
  private service = new MarkerService();

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

  @Post()
  @Authorized()
  @UseBefore(imageUploadMiddleware)
  async create(
    @CurrentUser() user: IUser,
    @Req() req: Request,
  ): Promise<ApiResponse<IMarker>> {
    const file = req.file;
    const dto = plainToInstance(CreateMarkerDto, req.body, {
      excludeExtraneousValues: true,
    });

    if (file) {
      dto.imageUrl = await saveFileToCloudinary(file);
    }

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0)
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR", errors);

    const markerData = mapCreateMarkerDto(dto);
    const marker = await this.service.create(markerData, user.id);
    return new ApiResponse(true, 201, "Marker created successfully", marker);
  }

  @Put("/:id")
  @Authorized()
  @UseBefore(imageUploadMiddleware)
  async update(
    @CurrentUser() user: IUser,
    @Param("id") id: string,
    @Req() req: Request,
  ): Promise<ApiResponse<IMarker>> {
    const file = req.file;
    const dto = plainToInstance(UpdateMarkerDto, req.body, {
      excludeExtraneousValues: true,
    });

    if (file) {
      dto.imageUrl = await saveFileToCloudinary(file);
    }

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0)
      throw new ApiError(400, "Validation failed", "VALIDATION_ERROR", errors);

    const updatedData = mapUpdateMarkerDto(dto);
    const updated = await this.service.update(id, user.id, updatedData);
    return new ApiResponse(true, 200, "Marker updated successfully", updated);
  }

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
