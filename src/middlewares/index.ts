import { HTTPRequestLogger } from "./HTTPRequestLogger";
import { HTTPResponseLogger } from "./HTTPResponseLogger";
import { ErrorHandler } from "./ErrorHandler";

type Middleware = typeof HTTPRequestLogger | typeof HTTPResponseLogger;

const middlewares = <Middleware[]>[
  HTTPRequestLogger,
  HTTPResponseLogger,
  ErrorHandler,
];

export { middlewares };
