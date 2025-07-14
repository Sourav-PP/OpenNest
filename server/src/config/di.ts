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
import { MongoAdminRepository } from "../infrastructure/repositories/admin/adminRepository";
import { AdminAuthAccountRepository } from "../infrastructure/repositories/admin/adminAuthAccountRepository";

// -------------- shared ---------------
import { MongoServiceRepository } from "../infrastructure/repositories/serviceRepository";


//===================== SERVICES ======================

// shared services
import { BcryptAuthService } from "../infrastructure/auth/authService";
import { JwtTokenService } from "../infrastructure/auth/tokenService";
import { NodemailerOtpService } from "../infrastructure/auth/otpService";


// ==================== USE CASES =======================

//--------------- user ---------------
import { SignupUseCase } from "../useCases/user/signup/signupUseCase";
import { SendOtpUseCase } from "../useCases/user/signup/sendOtpUseCase";
import { VerifyOtpUseCase } from "../useCases/user/signup/verifyOtpUseCase";
import { LoginUseCase } from "../useCases/user/login/loginUseCase";
import { RefreshTokenUseCase } from "../useCases/refreshToken/refreshTokenUseCase";
import { GetAllServiceUseCase } from "../useCases/user/services/getAllServicesUseCase";

//--------------- psychologist ------------------
import { VerifyPsychologistUseCase } from "../useCases/psychologist/verifyPsychologist/verifyUseCase";

//--------------- admin -----------------
import { AdminLoginUseCase } from "../useCases/admin/auth/loginUseCase";
import { CreateServiceUseCase } from "../useCases/admin/services/createServiceUseCase";
import { AdminLogoutUseCase } from "../useCases/admin/auth/logoutUseCase";


//===================== CONTROLLERS =====================

//---------------- user ------------------
import { AuthController } from "../interface/http/controllers/authController";
import { RefreshTokenController } from "../interface/http/controllers/refreshTokenController";
import { GetAllServicesController } from "../interface/http/controllers/user/getAllServicesController";

//---------------- psychologist -----------------
import { VerifyPsychologistController } from "../interface/http/controllers/verifyPsychologistController";

//---------------- admin -------------------
import { AdminAuthController } from "../interface/http/controllers/admin/adminAuthController";
import { CreateServiceController } from "../interface/http/controllers/admin/createServiceController";


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
const userServiceRepository = new MongoServiceRepository()
const psychologistRepository = new MongoPsychologistRepository()


const signupUseCase = new SignupUseCase( userRepository, authService, tokenService, otpService );
const loginUseCase = new LoginUseCase( userRepository, authService, tokenService, psychologistRepository );
const sendOtpUseCase = new SendOtpUseCase(otpService);
const verifyOtpUseCase = new VerifyOtpUseCase(otpService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userAuthRepository)
const getAllServicesUseCase = new GetAllServiceUseCase(userServiceRepository)

export const authController = new AuthController(
  signupUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  loginUseCase,
);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase, "refreshToken")
export const userGetAllServicesController = new GetAllServicesController(getAllServicesUseCase)


// ---------- PSYCHOLOGIST ----------

const kycRepository = new MongoKycRepository()

const verifyPsychologistUseCase = new VerifyPsychologistUseCase(psychologistRepository, kycRepository)

export const verifyPsychologistController = new VerifyPsychologistController(verifyPsychologistUseCase)


// ---------- ADMIN ----------

const adminRepository = new MongoAdminRepository()
const adminAuthRepository = new AdminAuthAccountRepository()
const adminRefreshTokenUseCase = new RefreshTokenUseCase(tokenService, adminAuthRepository)
const adminLoginUseCase = new AdminLoginUseCase(adminRepository, tokenService, authService)
const adminLogoutUseCase = new AdminLogoutUseCase()
const serviceRepository = new MongoServiceRepository()
const createServiceUseCase = new CreateServiceUseCase(serviceRepository)

export const adminAuthController = new AdminAuthController(adminLoginUseCase, adminLogoutUseCase)
export const adminRefreshTokenController  = new RefreshTokenController(adminRefreshTokenUseCase, "adminRefreshToken")
export const createServiceController = new CreateServiceController(createServiceUseCase)