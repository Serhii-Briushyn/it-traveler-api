// import { HttpError } from "routing-controllers";
// import type { ValidationError } from "class-validator";

// interface ApiErrorPayload {
//   status: number;
//   message?: string;
//   code: string;
//   errors?: ValidationError[];
// }
// export class ApiError extends HttpError {
//   protected error: ApiErrorPayload;

//   constructor(status = 500, error: Omit<ApiErrorPayload, "status">) {
//     super(status);

//     this.error = { ...error, status, code: error.code || "INTERNAL_ERROR" };

//     this.name = "ApiError";

//     this.message = error.message || "";
//   }

//   public toJSON = (): ApiErrorPayload => {
//     return this.error;
//   };
// }
import { HttpError } from "routing-controllers";
import type { ValidationError } from "class-validator";

export interface ApiErrorPayload {
  status: number;
  message: string;
  code?: string;
  errors?: ValidationError[];
}

export class ApiError extends HttpError {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly code: string = "INTERNAL_ERROR",
    public readonly errors?: ValidationError[],
  ) {
    super(status);
    this.name = "ApiError";

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  toJSON(): ApiErrorPayload & { success: false } {
    return {
      success: false,
      status: this.status,
      message: this.message,
      code: this.code,
      errors: this.errors,
    };
  }
}
