import { MarkerCollection, MarkerDocument } from "models/Marker.model";
import { IMarker } from "types/marker.types";
import { ICreateMarkerDto, IUpdateMarkerDto } from "./Marker.types";
import { ApiError } from "shared/ApiError";

export class MarkerService {
  // ─────────────────── Get All ───────────────────
  async getAllMarkersByUser(userId: string): Promise<IMarker[]> {
    const markers = (await MarkerCollection.find({
      userId,
    })) as MarkerDocument[];

    return markers.map((marker) => marker.toJSON());
  }

  // ─────────────────── Create ───────────────────

  async create(data: ICreateMarkerDto, userId: string): Promise<IMarker> {
    const created = (await MarkerCollection.create({
      ...data,
      userId,
    })) as MarkerDocument;

    return created.toJSON();
  }

  // ─────────────────── Update ───────────────────

  async update(
    markerId: string,
    userId: string,
    data: IUpdateMarkerDto,
  ): Promise<IMarker> {
    const updated = (await MarkerCollection.findOneAndUpdate(
      { _id: markerId, userId },
      data,
      { new: true },
    )) as MarkerDocument | null;

    if (!updated) {
      throw new ApiError(404, "Marker not found", "MARKER_NOT_FOUND");
    }

    return updated.toJSON();
  }

  // ─────────────────── Delete ───────────────────

  async delete(markerId: string, userId: string): Promise<void> {
    const result = await MarkerCollection.findOneAndDelete({
      _id: markerId,
      userId,
    });

    if (!result) {
      throw new ApiError(404, "Marker not found", "MARKER_NOT_FOUND");
    }
  }
}
