import { MarkerCollection, MarkerDocument } from "models/marker.model";
import { IMarker } from "types/marker.types";
import { ApiError } from "shared/api-error";
import { IMarkerCreate, IMarkerUpdate } from "./marker.types";
import { isValidObjectId } from "mongoose";

export class MarkerService {
  // ─────────────────── Get All ───────────────────
  async getAllMarkersByUser(userId: string): Promise<IMarker[]> {
    const markers = (await MarkerCollection.find({
      userId,
    })) as MarkerDocument[];
    return markers.map((marker) => marker.toJSON());
  }

  // ─────────────────── Create ───────────────────

  async create(data: IMarkerCreate, userId: string): Promise<IMarker> {
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
    data: IMarkerUpdate,
  ): Promise<IMarker> {
    const updated = (await MarkerCollection.findOneAndUpdate(
      { _id: markerId, userId },
      data,
      { new: true },
    )) as MarkerDocument | null;

    if (!isValidObjectId(markerId)) {
      throw new ApiError(400, "Invalid marker ID", "INVALID_ID");
    }

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
