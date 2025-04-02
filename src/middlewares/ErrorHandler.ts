import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "shared/ApiError";
import { HttpError } from "routing-controllers";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response, next: NextFunction): void {
    if (error.name === "AuthorizationRequiredError") {
      res.status(401).json({
        success: false,
        status: 401,
        message: "Authorization token is missing or invalid",
        code: "UNAUTHORIZED",
      });
      return;
    }

    if (error instanceof ApiError) {
      res.status(error.status).json(error.toJSON());
      return;
    }

    if (error instanceof HttpError) {
      res.status(error.httpCode).json({
        success: false,
        status: error.httpCode,
        message: error.message,
      });
      return;
    }

    console.error("Unhandled error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Internal Server Error",
    });
    return;
  }
}
