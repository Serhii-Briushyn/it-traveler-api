import { IUser } from "types/user.types";

export interface IAuthPayload {
  name?: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Pick<IUser, "name" | "email" | "id">;
  accessToken: string;
  refreshToken: string;
}
