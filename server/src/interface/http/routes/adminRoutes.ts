import express, { NextFunction, Request, Response } from "express";
import { uploadSingle } from "../middlewares/multer";

//validators
import { loginValidate, loginValidator } from "../validators/loginValidator";
import { createServiceValidator, validateCreateService } from "../validators/createServiceValidator";

//controllers
import { adminAuthController } from "../../../config/di";
import { adminRefreshTokenController } from "../../../config/di";
import { createServiceController } from "../../../config/di";


const router = express.Router();

// const loggerMiddleware = (label: string) => (req: Request, res: Response, next: NextFunction  ) => {
//   console.log(`>> Hit: ${label}`);
//   next();
// };


router.post(
  "/login",
  loginValidator,
  loginValidate,
  adminAuthController.handle
);
router.post("/refresh-token", adminRefreshTokenController.handle);
router.post(
  "/services",
  uploadSingle,
  createServiceValidator,
  validateCreateService,
  createServiceController.handle
)

export default router;
