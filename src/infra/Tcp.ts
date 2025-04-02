import "reflect-metadata";
import express, { Express } from "express";
import { useExpressServer } from "routing-controllers";
import { IService } from "types/services";
import { controllers } from "app/domain/controllers";
import { middlewares } from "middlewares/index";
import {
  authorizationChecker,
  currentUserChecker,
} from "app/auth/Auth.checkers";

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

    useExpressServer(this.server, {
      routePrefix: this.routePrefix,
      controllers,
      middlewares,
      cors: true,
      defaultErrorHandler: false,
      validation: false,
      authorizationChecker,
      currentUserChecker,
    });

    return new Promise((resolve) => {
      this.server
        .listen(3000, () => {
          console.log("TCP service started on port 3000");
          resolve(true);
        })
        .on("error", (err) => {
          console.error("Server error:", err);
          process.exit(1);
        });
    });
  }
}
