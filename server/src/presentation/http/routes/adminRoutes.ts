import express, { NextFunction, Request, Response } from "express";
import { uploadSingle } from "../middlewares/multer";

//validators
import { loginValidate, loginValidator } from "../validators/loginValidator";
import { createServiceValidator, validateCreateService } from "../validators/createServiceValidator";

//controllers
import {
  adminAuthController,
  getAllUserController,
  createServiceController,
  adminRefreshTokenController,
  getAllPsychologistController
} from "../../../config/di";



const router = express.Router();

// const loggerMiddleware = (label: string) => (req: Request, res: Response, next: NextFunction  ) => {
//   console.log(`>> Hit: ${label}`);
//   next();
// };


router.post(
  "/login",
  loginValidator,
  loginValidate,
  adminAuthController.login
);
router.post(
  '/logout',
  adminAuthController.logout
)
router.post("/refresh-token", adminRefreshTokenController.handle);
router.post(
  "/services",
  uploadSingle,
  createServiceValidator,
  validateCreateService,
  createServiceController.handle
)
router.get("/users", getAllUserController.handle)
router.get("/psychologists", getAllPsychologistController.handle)


export default router;
