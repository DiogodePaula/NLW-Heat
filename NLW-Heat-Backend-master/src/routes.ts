import { Router } from "express";
import { AuthenticateUserController } from "./controller/AuthenticateUserController";
import { CreateMessageController } from "./controller/CreateMessageController";
import { GetLast3MessagesController } from "./controller/GetLast3MessagesController";
import { ProfileUserController } from "./controller/ProfileUserController";
import { ensureAuthenticate } from "./middleware/ensureAuthenticated";

const router = Router();

// aqui o metodo handle vai funcionar como se fosse um middleware não havendo 
// necessidade de passar os seus parametros por que automaticamente o express ja vai fazer isso.
router.post("/authenticate", new AuthenticateUserController().handle);

router.post("/messages", ensureAuthenticate, new CreateMessageController().handle);
router.get("/messages/last3", new GetLast3MessagesController().handle);
router.get("/profile", new ProfileUserController().handle);

export { router };
