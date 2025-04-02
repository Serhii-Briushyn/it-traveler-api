import { AuthController } from "app/auth";

type Controller = typeof AuthController;

const controllers: Controller[] = [AuthController];

export { controllers };
