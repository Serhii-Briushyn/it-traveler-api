import { AuthController } from "../../app/auth";
import { MarkerController } from "../../app/markers";

type Controller = typeof AuthController | typeof MarkerController;

const controllers: Controller[] = [AuthController, MarkerController];

export { controllers };
