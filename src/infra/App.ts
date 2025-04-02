import { initMongoConnection } from "./initMongoConnection";
import { Tcp } from "./Tcp";

import { IService } from "types/services";

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
