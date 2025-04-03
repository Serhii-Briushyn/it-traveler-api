export interface IMarker {
  id: string;
  title: string;
  description?: string;
  img?: string;
  coordinates: [number, number];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
