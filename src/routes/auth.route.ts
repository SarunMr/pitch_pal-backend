import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { authorizeMiddleware } from "../middlewares/auth.middleware";
import { uploads } from "../middlewares/upload.middleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/whoami", authorizeMiddleware, authController.whoami);
authRouter.put(
  "/update",
  authorizeMiddleware,
  uploads.single("profilePicture"),
  authController.updateUser,
);
authRouter.put("/reset-password", authorizeMiddleware, authController.resetPassword);

export default authRouter;
