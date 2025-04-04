import { Request, Response, NextFunction } from "express";

export function jsonSyntaxErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: "Invalid JSON payload",
      code: "INVALID_JSON",
    });
    return;
  }

  next(err);
}
