import dotenv from "dotenv";
dotenv.config();

// ====================   REPOSITORIES  ======================

// --------------  user  ----------------
import { MongoUserRepository } from "../infrastructure/repositories/userRepository";
import { UserAuthAccountRepository } from "../infrastructure/repositories/userAuthAccountRepository";
import { MongoOtpRepository } from "../infrastructure/repositories/otpRepository";

// -------------- psychologist ------------------
import { MongoKycRepository } from "../infrastructure/repositories/kycRepository";
import { MongoPsychologistRepository } from "../infrastructure/repositories/psychologistRepository";

// -------------- admin ----------------
import { MongoAdminRepository } from "../infrastructure/repositories/adminRepository";
import { AdminAuthAccountRepository } from "../infrastructure/repositories/adminAuthAccountRepository";


//===================== SERVICES ======================

// shared services
import { BcryptAuthService } from "../infrastructure/auth/authService";
import { JwtTokenService } from "../infrastructure/auth/tokenService";
import { NodemailerOtpService } from "../infrastructure/auth/otpService";


// ==================== USE CASES =======================

//--------------- user ---------------
import { SignupUseCase } from "../useCases/signup/signupUseCase";
import { SendOtpUseCase } from "../useCases/signup/sendOtpUseCase";
import { VerifyOtpUseCase } from "../useCases/signup/verifyOtpUseCase";
import { LoginUseCase } from "../useCases/login/loginUseCase";
import { RefreshTokenUseCase } from "../useCases/refreshToken/refreshTokenUseCase";

//--------------- psychologist ------------------
import { VerifyPsychologistUseCase } from "../useCases/verifyPsychologist/verifyUseCase";

//--------------- admin -----------------
import { AdminLoginUseCase } from "../useCases/admin/login/loginUseCase";


//===================== CONTROLLERS =====================

//---------------- user ------------------
import { AuthController } from "../interface/http/controllers/authController";
import { RefreshTokenController } from "../interface/http/controllers/refreshTokenController";

//---------------- psychologist -----------------
import { VerifyPsychologistController } from "../interface/http/controllers/verifyPsychologistController";

//---------------- admin -------------------
import { AdminAuthController } from "../interface/http/controllers/admin/adminAuthController";


//===================== MIDDLEWARE ========================
import { authMiddleware } from "../interface/http/middlewares/authMiddleware";


// ======================= DI IMPLEMENTATION =======================

// ---------- SERVICES ----------
const authService = new BcryptAuthService();
const tokenService = new JwtTokenService();
const otpRepository = new MongoOtpRepository();
const otpService = new NodemailerOtpService(otpRepository);

export const authenticate = authMiddleware(tokenService)


// ---------- user ------------

const userRepository = new MongoUserRepository();
const userAuthRepository = new UserAuthAccountRepository()

const signupUseCase = new SignupUseCase( userRepository, authService, tokenService, otpService );
const loginUseCase = new LoginUseCase( userRepository, authService, tokenService );
const sendOtpUseCase = new SendOtpUseCase(otpService);
const verifyOtpUseCase = new VerifyOtpUseCase(otpService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userAuthRepository)

export const authController = new AuthController(
  signupUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  loginUseCase,
);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase, "refreshToken")


// ---------- PSYCHOLOGIST ----------

const psychologistRepository = new MongoPsychologistRepository()
const kycRepository = new MongoKycRepository()

const verifyPsychologistUseCase = new VerifyPsychologistUseCase(psychologistRepository, kycRepository)

export const verifyPsychologistController = new VerifyPsychologistController(verifyPsychologistUseCase)


// ---------- ADMIN ----------

const adminRepository = new MongoAdminRepository()
const adminAuthRepository = new AdminAuthAccountRepository()
const adminRefreshTokenUseCase = new RefreshTokenUseCase(tokenService, adminAuthRepository)
const adminLoginUseCase = new AdminLoginUseCase(adminRepository, tokenService, authService)

export const adminAuthController = new AdminAuthController(adminLoginUseCase)
export const adminRefreshTokenController  = new RefreshTokenController(adminRefreshTokenUseCase, "adminRefreshToken")