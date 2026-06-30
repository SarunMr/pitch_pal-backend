import { Router } from "express";
import { AdminUserController } from "../controller/admin-user.controller";
import { authorizeMiddleware, adminOnlyMiddleware } from "../middlewares/auth.middleware";

const adminUserRouter = Router();
const adminUserController = new AdminUserController();

// All routes require a valid JWT AND admin role
adminUserRouter.use(authorizeMiddleware, adminOnlyMiddleware);

adminUserRouter.get("/", adminUserController.getUsers);
adminUserRouter.get("/:id", adminUserController.getUserById);
adminUserRouter.post("/", adminUserController.createUser);
adminUserRouter.put("/:id", adminUserController.updateUser);
adminUserRouter.delete("/:id", adminUserController.deleteUser);

export default adminUserRouter;
