import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageControler";
import { Get3LastMessageController } from "./controllers/GetLast3MessageController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const routes = Router();

const authController = new AuthenticateUserController();
const createdMessageController = new CreateMessageController();

routes.post("/authenticate", authController.handle);

routes.post("/messages", ensureAuthenticated, createdMessageController.handle);

routes.get("/messages/last3", new Get3LastMessageController().handle);

routes.get("/profile", ensureAuthenticated, new ProfileUserController().handle);

export { routes };
