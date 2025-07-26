import dotenv from "dotenv";
dotenv.config();

// ====================   REPOSITORIES  ======================

// --------------  user  ----------------
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { UserAuthAccountRepository } from "../infrastructure/repositories/UserAuthAccountRepository";
import { OtpRepository } from "../infrastructure/repositories/OtpRepository";

// -------------- psychologist ------------------
import { KycRepository } from "../infrastructure/repositories/KycRepository";
import { PsychologistRepository } from "../infrastructure/repositories/PsychologistRepository";

// -------------- admin ----------------
import { AdminRepository } from "../infrastructure/repositories/admin/adminRepository";
import { AdminAuthAccountRepository } from "../infrastructure/repositories/admin/adminAuthAccountRepository";

// -------------- shared ---------------
import { ServiceRepository } from "../infrastructure/repositories/ServiceRepository";


//===================== SERVICES ======================

// shared services
import { BcryptAuthService } from "../infrastructure/auth/authService";
import { JwtTokenService } from "../infrastructure/auth/tokenService";
import { NodemailerOtpService } from "../infrastructure/auth/otpService";


// ==================== USE CASES =======================

//--------------- user ---------------
import { SignupUseCase } from "../useCases/implementation/signup/signupUseCase";
import { SendOtpUseCase } from "../useCases/implementation/signup/sendOtpUseCase";
import { VerifyOtpUseCase } from "../useCases/implementation/signup/verifyOtpUseCase";
import { LoginUseCase } from "../useCases/implementation/auth/loginUseCase";
import { RefreshTokenUseCase } from "../useCases/implementation/auth/refreshTokenUseCase";
import { GetAllServiceUseCase } from "../useCases/implementation/user/data/getAllServicesUseCase";
import { LogoutUseCase } from "../useCases/implementation/auth/logoutUseCase";
import { GetAllPsychologistUseCasee } from "../useCases/implementation/user/data/getAllPsychologistUseCase";
import { GetUserProfileUseCase } from "../useCases/implementation/user/profile/getUserProfileUseCase";
import { UpdateUserProfileUseCase } from "../useCases/implementation/user/profile/updateUserProfileUseCase";

//--------------- psychologist ------------------
import { VerifyPsychologistUseCase } from "../useCases/implementation/psychologist/profile/verifyUseCase";
import { GetProfileUseCase } from "../useCases/implementation/psychologist/profile/getProfileUseCase";

//--------------- admin -----------------
import { AdminLoginUseCase } from "../useCases/implementation/admin/auth/loginUseCase";
import { CreateServiceUseCase } from "../useCases/implementation/admin/management/createServiceUseCase";
import { AdminLogoutUseCase } from "../useCases/implementation/admin/auth/logoutUseCase";


//===================== CONTROLLERS =====================

//---------------- user ------------------
import { AuthController } from "../presentation/http/controllers/auth/AuthController";
import { RefreshTokenController } from "../presentation/http/controllers/auth/RefreshTokenController";
import { GetAllServicesController } from "../presentation/http/controllers/user/GetAllServicesController";
import { GetAllPsychologistsController } from "../presentation/http/controllers/user/GetAllPsychologistsController";
import { GetUserProfileController } from "../presentation/http/controllers/user/GetUserProfileController";
import { UpdateUserProfileController } from "../presentation/http/controllers/user/UpdateUserProfileController";

//---------------- psychologist -----------------
import { VerifyPsychologistController } from "../presentation/http/controllers/psychologist/VerifyPsychologistController";
import { GetProfileController } from "../presentation/http/controllers/psychologist/GetProfileController";

//---------------- admin -------------------
import { AdminAuthController } from "../presentation/http/controllers/admin/AdminAuthController";
import { CreateServiceController } from "../presentation/http/controllers/admin/CreateServiceController";


//===================== MIDDLEWARE ========================
import { authMiddleware } from "../presentation/http/middlewares/authMiddleware";


// ======================= DI IMPLEMENTATION =======================

// ---------- SERVICES ----------
const authService = new BcryptAuthService();
const tokenService = new JwtTokenService();
const otpRepository = new OtpRepository();
const otpService = new NodemailerOtpService(otpRepository);

export const authenticateUser = authMiddleware(tokenService, ["user"]);
export const authenticatePsychologist = authMiddleware(tokenService, ["psychologist"]);
export const authenticateAdmin = authMiddleware(tokenService, ["admin"]);
export const authenticateAll = authMiddleware(tokenService, ["user", "psychologist", "admin"]);


// ---------- user ------------

const userRepository = new UserRepository();
const userAuthRepository = new UserAuthAccountRepository()
const userServiceRepository = new ServiceRepository()
const psychologistRepository = new PsychologistRepository()


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

const kycRepository = new KycRepository()

const verifyPsychologistUseCase = new VerifyPsychologistUseCase(psychologistRepository, kycRepository)
const getProfileUseCase = new GetProfileUseCase(psychologistRepository, kycRepository, userRepository)

export const verifyPsychologistController = new VerifyPsychologistController(verifyPsychologistUseCase)
export const getProfileController = new GetProfileController(getProfileUseCase)


// ---------- ADMIN ----------

const adminRepository = new AdminRepository()
const adminAuthRepository = new AdminAuthAccountRepository()
const adminRefreshTokenUseCase = new RefreshTokenUseCase(tokenService, adminAuthRepository)
const adminLoginUseCase = new AdminLoginUseCase(adminRepository, tokenService, authService)
const adminLogoutUseCase = new AdminLogoutUseCase()
const serviceRepository = new ServiceRepository()
const createServiceUseCase = new CreateServiceUseCase(serviceRepository)

export const adminAuthController = new AdminAuthController(adminLoginUseCase, adminLogoutUseCase)
export const adminRefreshTokenController  = new RefreshTokenController(adminRefreshTokenUseCase, "adminRefreshToken")
export const createServiceController = new CreateServiceController(createServiceUseCase)