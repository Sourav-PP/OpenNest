import dotenv from "dotenv";
dotenv.config();
import { MongoUserRepository } from "../infrastructure/repositories/userRepository";
import { MongoOtpRepository } from "../infrastructure/repositories/otpRepository";
import { BcryptAuthService } from "../infrastructure/auth/authService";
import { JwtTokenService } from "../infrastructure/auth/tokenService";
import { NodemailerOtpService } from "../infrastructure/auth/otpService";
import { MongoKycRepository } from "../infrastructure/repositories/kycRepository";
import { MongoPsychologistRepository } from "../infrastructure/repositories/psychologistRepository";

import { SignupUseCase } from "../useCases/signup/signupUseCase";
import { SendOtpUseCase } from "../useCases/signup/sendOtpUseCase";
import { VerifyOtpUseCase } from "../useCases/signup/verifyOtpUseCase";
import { LoginUseCase } from "../useCases/login/loginUseCase";
import { RefreshTokenUseCase } from "../useCases/refreshToken/refreshTokenUseCase";
import { VerifyPsychologistUseCase } from "../useCases/verifyPsychologist/verifyUseCase";


import { authMiddleware } from "../interface/http/middlewares/authMiddleware";

import { AuthController } from "../interface/http/controllers/authController";
import { RefreshTokenController } from "../interface/http/controllers/refreshTokenController";
import { VerifyPsychologistController } from "../interface/http/controllers/verifyPsychologistController";

// infrastructure
const userRepository = new MongoUserRepository();
const otpRepository = new MongoOtpRepository();
const authService = new BcryptAuthService();
const tokenService = new JwtTokenService();
const otpService = new NodemailerOtpService(otpRepository);
const psychologistRepository = new MongoPsychologistRepository()
const kycRepository = new MongoKycRepository()

export const authenticate = authMiddleware(tokenService)

// useCases
const signupUseCase = new SignupUseCase(
  userRepository,
  authService,
  tokenService,
  otpService
);
const loginUseCase = new LoginUseCase(
  userRepository,
  authService,
  tokenService
);
const sendOtpUseCase = new SendOtpUseCase(otpService);
const verifyOtpUseCase = new VerifyOtpUseCase(otpService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userRepository)
const verifyPsychologistUseCase = new VerifyPsychologistUseCase(psychologistRepository, kycRepository)

// controllers
export const authController = new AuthController(
  signupUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  loginUseCase,
);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase)
export const verifyPsychologistController = new VerifyPsychologistController(verifyPsychologistUseCase)
