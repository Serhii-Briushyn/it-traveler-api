import { HTTPRequestLogger } from "./http-request-logger";
import { HTTPResponseLogger } from "./http-response-logger";
import { ErrorHandler } from "./error-handler";

type Middleware = typeof HTTPRequestLogger | typeof HTTPResponseLogger;

const middlewares = <Middleware[]>[
  HTTPRequestLogger,
  HTTPResponseLogger,
  ErrorHandler,
];

export { middlewares };
