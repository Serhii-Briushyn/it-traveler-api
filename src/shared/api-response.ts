export class ApiResponse<T> {
  constructor(
    public readonly success: boolean,
    public readonly status: number,
    public readonly message: string,
    public readonly data: T,
  ) {}

  static success<T>(
    data: T,
    message: string,
    status: number = 200,
  ): ApiResponse<T> {
    return new ApiResponse(true, status, message, data);
  }

  static fail<T>(
    message: string,
    status: number = 400,
    data: T = null as T,
  ): ApiResponse<T> {
    return new ApiResponse(true, status, message, data);
  }
}
