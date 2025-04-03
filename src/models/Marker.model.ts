import { Schema, model, Types, Document } from "mongoose";
import { IMarker } from "../types/marker.types";

export interface MarkerDocument extends Document {
  title: string;
  description?: string;
  img?: string;
  coordinates: [number, number];
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  toJSON(): IMarker;
}

const markerSchema = new Schema<MarkerDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (val: number[]) => Array.isArray(val) && val.length === 2,
        message: "Coordinates must contain exactly [lat, lng]",
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
