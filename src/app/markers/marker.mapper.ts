import { CreateMarkerDto, UpdateMarkerDto } from "./marker.dto";
import { IMarkerCreate, IMarkerUpdate } from "./marker.types";

export function mapCreateMarkerDto(dto: CreateMarkerDto): IMarkerCreate {
  return {
    title: dto.title,
    description: dto.description,
    imageUrl: dto.imageUrl,
    geometry: {
      type: "Point",
      coordinates: dto.coordinates,
    },
  };
}

export function mapUpdateMarkerDto(dto: UpdateMarkerDto): IMarkerUpdate {
  const update: IMarkerUpdate = {};

  if (dto.title) update.title = dto.title;
  if (dto.description) update.description = dto.description;
  if (dto.imageUrl) update.imageUrl = dto.imageUrl;

  if (dto.coordinates) {
    update.geometry = {
      type: "Point",
      coordinates: dto.coordinates,
    };
  }

  return update;
}
