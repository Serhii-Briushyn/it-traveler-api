import { IGeoPoint } from "types/marker.types";

export interface IMarkerCreate {
  title: string;
  description?: string;
  imageUrl?: string;
  geometry: IGeoPoint;
}

export interface IMarkerUpdate {
  title?: string;
  description?: string;
  imageUrl?: string;
  geometry?: IGeoPoint;
}
