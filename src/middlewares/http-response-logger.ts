import type { NextFunction, Request, Response } from "express";
import {
  Middleware,
  type ExpressMiddlewareInterface,
} from "routing-controllers";

@Middleware({ type: "after" })
export class HTTPResponseLogger implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction) {
    const { originalUrl, method } = request;
    const { statusCode } = response;

    console.log(
      `Response request: method=${method} path=${originalUrl} statusCode=${statusCode}`,
    );

    next();
  }
}
