import { Router } from "express";
import { UserController } from "./user.controller";
import { validate } from "../../middleware/validate";
import { userSignUpSchema } from "./user.schema";

const router = Router();

router.post("/signUp", validate(userSignUpSchema), UserController.createUser);

export default router;
