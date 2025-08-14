import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion:  '2025-07-30.basil',
});

// ====================   REPOSITORIES  ======================

// --------------  user  ----------------
import { UserRepository } from '../infrastructure/repositories/user/userRepository';
import { UserAuthAccountRepository } from '../infrastructure/repositories/user/userAuthAccountRepository';
import { OtpRepository } from '../infrastructure/repositories/otpRepository';
import { PaymentRepository } from '../infrastructure/repositories/user/paymentRepository';
import { ConsultationRepository } from '../infrastructure/repositories/user/consultationRepository';

// -------------- psychologist ------------------
import { KycRepository } from '../infrastructure/repositories/kycRepository';
import { PsychologistRepository } from '../infrastructure/repositories/psychologistRepository';
import { SlotRepository } from '../infrastructure/repositories/slotRepository';

// -------------- admin ----------------
import { AdminRepository } from '../infrastructure/repositories/admin/adminRepository';
import { AdminAuthAccountRepository } from '../infrastructure/repositories/admin/adminAuthAccountRepository';

// -------------- shared ---------------
import { ServiceRepository } from '../infrastructure/repositories/serviceRepository';


//===================== SERVICES ======================

// shared services
import { GoogleAuthService } from '../infrastructure/repositories/googleAuthService';
import { BcryptAuthService } from '../infrastructure/auth/authService';
import { JwtTokenService } from '../infrastructure/auth/tokenService';
import { NodemailerOtpService } from '../infrastructure/auth/otpService';
import { PaymentService } from '../infrastructure/services/paymentService';


// ==================== USE CASES =======================

//--------------- user ---------------
import { SignupUseCase } from '../useCases/implementation/signup/signupUseCase';
import { SendOtpUseCase } from '../useCases/implementation/signup/sendOtpUseCase';
import { VerifyOtpUseCase } from '../useCases/implementation/signup/verifyOtpUseCase';
import { LoginUseCase } from '../useCases/implementation/auth/loginUseCase';
import { RefreshTokenUseCase } from '../useCases/implementation/auth/refreshTokenUseCase';
import { GetAllServiceUseCase } from '../useCases/implementation/user/data/getAllServicesUseCase';
import { LogoutUseCase } from '../useCases/implementation/auth/logoutUseCase';
import { GetAllPsychologistUseCasee } from '../useCases/implementation/user/data/getAllPsychologistUseCase';
import { GetUserProfileUseCase } from '../useCases/implementation/user/profile/getUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../useCases/implementation/user/profile/updateUserProfileUseCase';
import { GetPsychologistDetailsUseCase } from '../useCases/implementation/user/data/getPsychologistDetails';
import { GoogleLoginUseCase } from '../useCases/implementation/auth/googleLoginUseCase';
import { GetSlotForUserUseCase } from '../useCases/implementation/user/data/getSlotForUserUseCase';
import { CreateCheckoutSessionUseCase } from '../useCases/implementation/user/payment/createCheckoutSessionUseCase';
import { HandleWebhookUseCase } from '../useCases/implementation/user/payment/handleWebhookUseCase';
import { GetUserConsultationsUseCase } from '../useCases/implementation/user/data/getUserConsultationsUseCase';

//--------------- psychologist ------------------
import { VerifyPsychologistUseCase } from '../useCases/implementation/psychologist/profile/verifyUseCase';
import { GetProfileUseCase } from '../useCases/implementation/psychologist/profile/getProfileUseCase';
import { UpdatePsychologistProfileUseCase } from '../useCases/implementation/psychologist/profile/updatePsychologistProfileUseCase';
import { CreateSlotUseCase } from '../useCases/implementation/psychologist/availability/CreateSlotUseCase';
import { GetSlotByPsychologistUseCase } from '../useCases/implementation/psychologist/availability/GetSlotByPsychologistUseCase';
import { DeleteSlotUseCase } from '../useCases/implementation/psychologist/availability/DeleteSlotUseCase';
import { GetKycDetailsUseCase } from '../useCases/implementation/psychologist/profile/getKycDetailsUseCase';

//--------------- admin -----------------
import { AdminLoginUseCase } from '../useCases/implementation/admin/auth/loginUseCase';
import { CreateServiceUseCase } from '../useCases/implementation/admin/management/createServiceUseCase';
import { AdminLogoutUseCase } from '../useCases/implementation/admin/auth/logoutUseCase';
import { GetAllUserUseCase } from '../useCases/implementation/admin/management/getAllUserUseCase';
import { GetAllPsychologistsUseCase } from '../useCases/implementation/admin/management/getAllPsychologistsUseCase';
import { ToggleUserStatusUseCase } from '../useCases/implementation/admin/management/toggleUserStatusUseCase';
import { GetAllKycUseCase } from '../useCases/implementation/admin/management/getAllKycUseCase';
import { GetKycForPsychologistUseCase } from '../useCases/implementation/admin/management/getKycForPsychologistUseCase';
import { ApproveKycUseCase } from '../useCases/implementation/admin/management/approveKycUseCase';
import { RejectKycUseCase } from '../useCases/implementation/admin/management/rejectKycUseCase';

//===================== CONTROLLERS =====================

//---------------- user ------------------
import { AuthController } from '../presentation/http/controllers/auth/AuthController';
import { RefreshTokenController } from '../presentation/http/controllers/auth/RefreshTokenController';
import { GetAllServicesController } from '../presentation/http/controllers/user/getAllServicesController';
import { GetAllPsychologistsController } from '../presentation/http/controllers/user/getAllPsychologistsController';
import { GetUserProfileController } from '../presentation/http/controllers/user/getUserProfileController';
import { UpdateUserProfileController } from '../presentation/http/controllers/user/updateUserProfileController';
import { GetPsychologistDetailsController } from '../presentation/http/controllers/user/getPsychologistDetailsController';
import { GoogleLoginController } from '../presentation/http/controllers/auth/GoogleLoginController';
import { GetSlotsForUserController } from '../presentation/http/controllers/user/getSlotForUserController';
import { PaymentController } from '../presentation/http/controllers/user/paymentController';
import { GetUserConsultationsController } from '../presentation/http/controllers/user/getUserConsultationsController';


//---------------- psychologist -----------------
import { VerifyPsychologistController } from '../presentation/http/controllers/psychologist/VerifyPsychologistController';
import { GetProfileController } from '../presentation/http/controllers/psychologist/getProfileController';
import { UpdatePsychologistProfileController } from '../presentation/http/controllers/psychologist/updatePsychologistProfileController';
import { CreateSlotController } from '../presentation/http/controllers/psychologist/createSlotController';
import { GetSlotByPsychologistController } from '../presentation/http/controllers/psychologist/getSlotByPsychologistController';
import { DeleteSlotController } from '../presentation/http/controllers/psychologist/deleteSlotController';
import { GetKycDetailsController } from '../presentation/http/controllers/psychologist/getKycDetailsController';

//---------------- admin -------------------
import { AdminAuthController } from '../presentation/http/controllers/admin/adminAuthController';
import { CreateServiceController } from '../presentation/http/controllers/admin/createServiceController';
import { GetAllUserController } from '../presentation/http/controllers/admin/getAllUserController';
import { GetAllPsychologistController } from '../presentation/http/controllers/admin/getAllPsychologistsController';
import { ToggleUserStatusController } from '../presentation/http/controllers/admin/toggleUserStatusController';
import { GetAllKycController } from '../presentation/http/controllers/admin/getAllKycController';
import { GetKycForPsychologistController } from '../presentation/http/controllers/admin/getKycForPsychologistController';
import { ApproveKycController } from '../presentation/http/controllers/admin/approveKycController';
import { RejectKycController } from '../presentation/http/controllers/admin/rejectKycController';


//===================== MIDDLEWARE ========================
import { authMiddleware } from '../presentation/http/middlewares/authMiddleware';
import { checkBlockedMiddleware } from '../presentation/http/middlewares/checkBlockedMiddleware';


// ======================= DI IMPLEMENTATION =======================

// ---------- SERVICES ----------
const authService = new BcryptAuthService();
const tokenService = new JwtTokenService();
const otpRepository = new OtpRepository();
const otpService = new NodemailerOtpService(otpRepository);
const userRepository = new UserRepository();

export const authenticateUser = authMiddleware(tokenService, ['user']);
export const authenticatePsychologist = authMiddleware(tokenService, ['psychologist']);
export const authenticateAdmin = authMiddleware(tokenService, ['admin']);
export const authenticateAll = authMiddleware(tokenService, ['user', 'psychologist', 'admin']);

export const checkBlockedUser = checkBlockedMiddleware(userRepository);


// ---------- user ------------

const kycRepository = new KycRepository();
const googleAuthService = new GoogleAuthService();
const slotRepository = new SlotRepository();
const paymentService = new PaymentService(stripe);

const userAuthRepository = new UserAuthAccountRepository();
const userServiceRepository = new ServiceRepository();
const psychologistRepository = new PsychologistRepository();
const paymentRepository = new PaymentRepository();
const consultationRepository = new ConsultationRepository();


const signupUseCase = new SignupUseCase( userRepository, authService, tokenService, otpService );
const loginUseCase = new LoginUseCase( userRepository, authService, tokenService, psychologistRepository );
const googleLoginUseCase = new GoogleLoginUseCase(tokenService,userRepository, googleAuthService, psychologistRepository );
const logoutUseCase = new LogoutUseCase();
const sendOtpUseCase = new SendOtpUseCase(otpService);
const verifyOtpUseCase = new VerifyOtpUseCase(otpService, tokenService, userRepository, authService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userAuthRepository);
const getAllServicesUseCase = new GetAllServiceUseCase(userServiceRepository);
const getAllPsychologistUseCase = new GetAllPsychologistUseCasee(psychologistRepository);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
const getPsychologistDetailsUseCase = new GetPsychologistDetailsUseCase(psychologistRepository, kycRepository, userRepository);
const getSlotsForUserUseCase = new GetSlotForUserUseCase(slotRepository, psychologistRepository);
const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(paymentService, paymentRepository, slotRepository);
const handleWebhookUseCase = new HandleWebhookUseCase(paymentRepository, paymentService, consultationRepository, slotRepository);
const getUserConsultationsUseCase = new GetUserConsultationsUseCase(consultationRepository);

export const authController = new AuthController(
    signupUseCase,
    sendOtpUseCase,
    verifyOtpUseCase,
    loginUseCase,
    logoutUseCase,
);
export const googleLoginController = new GoogleLoginController(googleLoginUseCase);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase, 'refreshToken');
export const userGetAllServicesController = new GetAllServicesController(getAllServicesUseCase);
export const getAllPsychologistsController = new GetAllPsychologistsController(getAllPsychologistUseCase);
export const getUserProfileController = new GetUserProfileController(getUserProfileUseCase);
export const updateUserProfileController = new UpdateUserProfileController(updateUserProfileUseCase);
export const getPsychologistDetailsController = new GetPsychologistDetailsController(getPsychologistDetailsUseCase);
export const getSlotsForUserController = new GetSlotsForUserController(getSlotsForUserUseCase);
export const paymentController = new PaymentController(createCheckoutSessionUseCase, handleWebhookUseCase, slotRepository);
export const getUserConsultationsController = new GetUserConsultationsController(getUserConsultationsUseCase);


// ---------- PSYCHOLOGIST ----------

const verifyPsychologistUseCase = new VerifyPsychologistUseCase(psychologistRepository, kycRepository);
const getProfileUseCase = new GetProfileUseCase(psychologistRepository, kycRepository, userRepository);
const updatePsychologistProfileUseCase = new UpdatePsychologistProfileUseCase(psychologistRepository, userRepository);
const createSlotUseCase = new CreateSlotUseCase(slotRepository, psychologistRepository);
const getSlotByPsychologistUseCase = new GetSlotByPsychologistUseCase(slotRepository);
const deleteSlotUseCase = new DeleteSlotUseCase(slotRepository);
const getKycDetailsUseCase = new GetKycDetailsUseCase(kycRepository);

export const verifyPsychologistController = new VerifyPsychologistController(verifyPsychologistUseCase);
export const getProfileController = new GetProfileController(getProfileUseCase);
export const updatePsychologistProfileController = new UpdatePsychologistProfileController(updatePsychologistProfileUseCase);
export const createSlotController = new CreateSlotController(createSlotUseCase, psychologistRepository);
export const getSlotByPsychologistController = new GetSlotByPsychologistController(getSlotByPsychologistUseCase, psychologistRepository);
export const deleteSlotController = new DeleteSlotController(deleteSlotUseCase, psychologistRepository);
export const getKycDetailsController = new GetKycDetailsController(getKycDetailsUseCase,psychologistRepository);


// ---------- ADMIN ----------

const adminRepository = new AdminRepository();
const adminAuthRepository = new AdminAuthAccountRepository();
const adminRefreshTokenUseCase = new RefreshTokenUseCase(tokenService, adminAuthRepository);
const adminLoginUseCase = new AdminLoginUseCase(adminRepository, tokenService, authService);
const adminLogoutUseCase = new AdminLogoutUseCase();
const serviceRepository = new ServiceRepository();
const createServiceUseCase = new CreateServiceUseCase(serviceRepository);
const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const getAllPsychologistsUseCase = new GetAllPsychologistsUseCase(psychologistRepository);
const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userRepository);
const getAllKycUseCase = new GetAllKycUseCase(kycRepository);
const getKycForPsychologistUseCase = new GetKycForPsychologistUseCase(kycRepository);
const approveKycUseCase = new ApproveKycUseCase(kycRepository,psychologistRepository);
const rejectKycUseCase = new RejectKycUseCase(kycRepository,psychologistRepository);

export const adminAuthController = new AdminAuthController(adminLoginUseCase, adminLogoutUseCase);
export const adminRefreshTokenController  = new RefreshTokenController(adminRefreshTokenUseCase, 'adminRefreshToken');
export const createServiceController = new CreateServiceController(createServiceUseCase);
export const getAllUserController = new GetAllUserController(getAllUserUseCase);
export const getAllPsychologistController = new GetAllPsychologistController(getAllPsychologistsUseCase); 
export const toggleUserStatusController = new ToggleUserStatusController(toggleUserStatusUseCase);
export const getAllKycController = new GetAllKycController(getAllKycUseCase);
export const getKycForPsychologistController = new GetKycForPsychologistController(getKycForPsychologistUseCase);
export const approveKycController = new ApproveKycController(approveKycUseCase);
export const rejectKycController = new RejectKycController(rejectKycUseCase);