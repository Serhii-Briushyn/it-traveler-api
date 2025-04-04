export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IMarker {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  geometry: IGeoPoint;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
