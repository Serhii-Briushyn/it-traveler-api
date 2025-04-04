import "reflect-metadata";
import express, { Express } from "express";
import { useExpressServer } from "routing-controllers";
import { IService } from "types/service.types";
import { controllers } from "app/domain/controllers";
import { middlewares } from "middlewares/index";
import { jsonSyntaxErrorHandler } from "middlewares/json-syntax-error-handler";
import { authorizationChecker } from "infra/security/authorization-checker";
import { currentUserChecker } from "infra/security/current-user-checker";
import { env } from "utils/env";

export class Tcp implements IService {
  private static instance: Tcp;
  public server!: Express;
  private readonly routePrefix: string = "/api";

  constructor() {
    if (!Tcp.instance) {
      this.server = express();
      Tcp.instance = this;
    }

    return Tcp.instance;
  }

  async init(): Promise<boolean> {
    this.server.use(express.json());
    this.server.use(jsonSyntaxErrorHandler);

    useExpressServer(this.server, {
      routePrefix: this.routePrefix,
      controllers,
      middlewares,
      cors: true,
      defaultErrorHandler: true,
      validation: {
        whitelist: true,
        forbidNonWhitelisted: true,
      },
      classTransformer: true,
      authorizationChecker,
      currentUserChecker,
    });

    return new Promise((resolve) => {
      const port = parseInt(env("PORT", "3000"));

      this.server
        .listen(port, () => {
          console.log(`TCP service started on port ${port}`);
          resolve(true);
        })
        .on("error", (err) => {
          console.error("Server error:", err);
          process.exit(1);
        });
    });
  }
}
