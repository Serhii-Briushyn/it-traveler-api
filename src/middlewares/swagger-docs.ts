import path from "node:path";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import swaggerUI from "swagger-ui-express";
import fs from "node:fs";

export const swaggerDocs = () => {
  const swaggerPath = path.join(process.cwd(), "docs", "swagger.json");
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch {
    return (req: Request, res: Response, next: NextFunction) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
