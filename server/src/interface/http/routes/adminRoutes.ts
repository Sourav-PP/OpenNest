import express from "express";

//validators
import { loginValidate, loginValidator } from "../validators/loginValidator";

//controllers
import { adminAuthController } from "../../../config/di";
import { adminRefreshTokenController } from "../../../config/di";

const router = express.Router();

router.post(
  "/login",
  loginValidator,
  loginValidate,
  adminAuthController.handle
);
router.post("/refresh-token", adminRefreshTokenController.handle);

export default router;
