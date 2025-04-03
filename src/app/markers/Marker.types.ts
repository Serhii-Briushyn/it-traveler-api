export interface ICreateMarkerDto {
  title: string;
  description?: string;
  img?: string;
  coordinates: [number, number];
}

export interface IUpdateMarkerDto {
  title?: string;
  description?: string;
  img?: string;
  coordinates?: [number, number];
}
