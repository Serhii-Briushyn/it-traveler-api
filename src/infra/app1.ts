import { initMongoConnection } from "./init-mongo-connection";
import { Tcp } from "./tcp";

import { IService } from "../types/service.types";

export class App implements IService {
  private static instance: App;
  private tcp: IService = new Tcp();

  constructor() {
    if (!App.instance) {
      App.instance = this;
    }

    return App.instance;
  }

  async init() {
    await initMongoConnection();
    await this.tcp.init();

    console.log("App initialized successfully.");
    return true;
  }
}
