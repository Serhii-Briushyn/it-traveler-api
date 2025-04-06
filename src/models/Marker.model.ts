import { Schema, model, Types, Document } from "mongoose";
import { IGeoPoint, IMarker } from "../types/marker.types";

export interface MarkerDocument extends Document {
  title: string;
  description?: string;
  imageUrl?: string;
  geometry: IGeoPoint;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  toJSON(): IMarker;
}

const markerSchema = new Schema<MarkerDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (val: number[]) =>
            Array.isArray(val) &&
            val.length === 2 &&
            val.every((n) => typeof n === "number"),
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

markerSchema.methods.toJSON = function (): IMarker {
  const { _id, __v, ...rest } = this.toObject();
  return {
    id: _id.toString(),
    ...rest,
    userId: rest.userId.toString(),
  };
};

export const MarkerCollection = model<MarkerDocument>("markers", markerSchema);
