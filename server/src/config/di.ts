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
import { LogoutUseCase } from "../useCases/user/logoutUseCase";
import { GetAllPsychologistUseCasee } from "../useCases/user/getPsychologists/getAllPsychologistUseCase";
import { GetUserProfileUseCase } from "../useCases/user/getUserProfile/getUserProfileUseCase";
import { UpdateUserProfileUseCase } from "../useCases/user/updateProfile/updateUserProfileUseCase";

//--------------- psychologist ------------------
import { VerifyPsychologistUseCase } from "../useCases/psychologist/verifyPsychologist/verifyUseCase";
import { GetProfileUseCase } from "../useCases/psychologist/getProfileUseCase";

//--------------- admin -----------------
import { AdminLoginUseCase } from "../useCases/admin/auth/loginUseCase";
import { CreateServiceUseCase } from "../useCases/admin/services/createServiceUseCase";
import { AdminLogoutUseCase } from "../useCases/admin/auth/logoutUseCase";


//===================== CONTROLLERS =====================

//---------------- user ------------------
import { AuthController } from "../presentation/http/controllers/authController";
import { RefreshTokenController } from "../presentation/http/controllers/refreshTokenController";
import { GetAllServicesController } from "../presentation/http/controllers/user/getAllServicesController";
import { GetAllPsychologistsController } from "../presentation/http/controllers/user/getAllPsychologistsController";
import { GetUserProfileController } from "../presentation/http/controllers/user/getUserProfileController";
import { UpdateUserProfileController } from "../presentation/http/controllers/user/updateUserProfileController";

//---------------- psychologist -----------------
import { VerifyPsychologistController } from "../presentation/http/controllers/verifyPsychologistController";
import { GetProfileController } from "../presentation/http/controllers/psychologist/getProfileController";

//---------------- admin -------------------
import { AdminAuthController } from "../presentation/http/controllers/admin/adminAuthController";
import { CreateServiceController } from "../presentation/http/controllers/admin/createServiceController";


//===================== MIDDLEWARE ========================
import { authMiddleware } from "../presentation/http/middlewares/authMiddleware";


// ======================= DI IMPLEMENTATION =======================

// ---------- SERVICES ----------
const authService = new BcryptAuthService();
const tokenService = new JwtTokenService();
const otpRepository = new MongoOtpRepository();
const otpService = new NodemailerOtpService(otpRepository);

export const authenticateUser = authMiddleware(tokenService, ["user"]);
export const authenticatePsychologist = authMiddleware(tokenService, ["psychologist"]);
export const authenticateAdmin = authMiddleware(tokenService, ["admin"]);
export const authenticateAll = authMiddleware(tokenService, ["user", "psychologist", "admin"]);


// ---------- user ------------

const userRepository = new MongoUserRepository();
const userAuthRepository = new UserAuthAccountRepository()
const userServiceRepository = new MongoServiceRepository()
const psychologistRepository = new MongoPsychologistRepository()


const signupUseCase = new SignupUseCase( userRepository, authService, tokenService, otpService );
const loginUseCase = new LoginUseCase( userRepository, authService, tokenService, psychologistRepository );
const logoutUseCase = new LogoutUseCase()
const sendOtpUseCase = new SendOtpUseCase(otpService);
const verifyOtpUseCase = new VerifyOtpUseCase(otpService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userAuthRepository)
const getAllServicesUseCase = new GetAllServiceUseCase(userServiceRepository)
const getAllPsychologistUseCase = new GetAllPsychologistUseCasee(psychologistRepository)
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository)
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository)

export const authController = new AuthController(
  signupUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  loginUseCase,
  logoutUseCase
);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase, "refreshToken")
export const userGetAllServicesController = new GetAllServicesController(getAllServicesUseCase)
export const getAllPsychologistsController = new GetAllPsychologistsController(getAllPsychologistUseCase)
export const getUserProfileController = new GetUserProfileController(getUserProfileUseCase)
export const updateUserProfileController = new UpdateUserProfileController(updateUserProfileUseCase)


// ---------- PSYCHOLOGIST ----------

const kycRepository = new MongoKycRepository()

const verifyPsychologistUseCase = new VerifyPsychologistUseCase(psychologistRepository, kycRepository)
const getProfileUseCase = new GetProfileUseCase(psychologistRepository, kycRepository, userRepository)

export const verifyPsychologistController = new VerifyPsychologistController(verifyPsychologistUseCase)
export const getProfileController = new GetProfileController(getProfileUseCase)


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