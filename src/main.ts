import { App } from "./infra/app1";

const bootstrap = async () => {
  try {
    const app = new App();
    await app.init();
  } catch (error) {
    console.error("Application failed to start:", error);
    process.exit(1);
  }
};

bootstrap();
