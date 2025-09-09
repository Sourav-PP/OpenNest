import Stripe from 'stripe';
import { appConfig } from './config';

const stripe = new Stripe(appConfig.stripe.secretKey, {
    apiVersion:  '2025-07-30.basil',
});

// ====================   REPOSITORIES  ======================

// --------------  user  ----------------
import { UserRepository } from '../repositories/user/userRepository';
import { UserAuthAccountRepository } from '../repositories/user/userAuthAccountRepository';
import { OtpRepository } from '../repositories/user/otpRepository';
import { PaymentRepository } from '../repositories/user/paymentRepository';
import { ConsultationRepository } from '../repositories/user/consultationRepository';
import { CloudinaryStorage } from '../fileStorage/cloudinaryStorage';
import { WalletRepository } from '../repositories/user/walletRepository';

// -------------- psychologist ------------------
import { KycRepository } from '../repositories/psychologist/kycRepository';
import { PsychologistRepository } from '../repositories/psychologist/psychologistRepository';
import { SlotRepository } from '../repositories/psychologist/slotRepository';

// -------------- admin ----------------
import { AdminRepository } from '../repositories/admin/adminRepository';
import { AdminAuthAccountRepository } from '../repositories/admin/adminAuthAccountRepository';

// -------------- shared ---------------
import { ServiceRepository } from '../repositories/admin/serviceRepository';


//===================== SERVICES ======================

// shared services
import { GoogleAuthService } from '../services/googleAuthService';
import { BcryptAuthService } from '../services/authService';
import { JwtTokenService } from '../services/tokenService';
import { NodemailerOtpService } from '../services/otpService';
import { PaymentService } from '../services/paymentService';


// ==================== USE CASES =======================

//--------------- user ---------------
import { SignupUseCase } from '../../useCases/implementation/signup/signupUseCase';
import { SendOtpUseCase } from '../../useCases/implementation/signup/sendOtpUseCase';
import { VerifyOtpUseCase } from '../../useCases/implementation/signup/verifyOtpUseCase';
import { LoginUseCase } from '../../useCases/implementation/auth/loginUseCase';
import { RefreshTokenUseCase } from '../../useCases/implementation/auth/refreshTokenUseCase';
import { VerifyForgotPasswordUseCase } from '@/useCases/implementation/auth/verifyForgotPasswordUseCase';
import { ResetPasswordUseCase } from '@/useCases/implementation/auth/resetPasswordUseCase';
import { ChangePasswordUseCase } from '@/useCases/implementation/auth/changePasswordUseCase';
import { GetAllServiceUseCase } from '../../useCases/implementation/user/data/getAllServicesUseCase';
import { LogoutUseCase } from '../../useCases/implementation/auth/logoutUseCase';
import { GetAllPsychologistsForUserUseCase } from '../../useCases/implementation/user/data/getAllPsychologistsForUserUseCase';
import { GetUserProfileUseCase } from '../../useCases/implementation/user/profile/getUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../useCases/implementation/user/profile/updateUserProfileUseCase';
import { GetPsychologistDetailsUseCase } from '../../useCases/implementation/user/data/getPsychologistDetailsUseCase';
import { GoogleLoginUseCase } from '../../useCases/implementation/auth/googleLoginUseCase';
import { GetSlotForUserUseCase } from '../../useCases/implementation/user/data/getSlotForUserUseCase';
import { CreateCheckoutSessionUseCase } from '../../useCases/implementation/user/payment/createCheckoutSessionUseCase';
import { HandleWebhookUseCase } from '../../useCases/implementation/user/payment/handleWebhookUseCase';
import { GetUserConsultationsUseCase } from '../../useCases/implementation/user/data/getUserConsultationsUseCase';
import { CreateWalletUseCase } from '@/useCases/implementation/user/wallet/createWalletUseCase';
import { GetWalletByIdUseCase } from '@/useCases/implementation/user/wallet/getWalletByIdUseCase';
import { GetWalletByUserUseCase } from '@/useCases/implementation/user/wallet/getWalletByUserUseCase';
import { CreateWalletTransactionUseCase } from '@/useCases/implementation/user/wallet/createWalletTransactionUseCase';
import { ListWalletTransactionsUseCase } from '@/useCases/implementation/user/wallet/listWalletTransactionsUseCase';
import { GetUserConsultationByIdUseCase } from '@/useCases/implementation/user/data/getUserConsultationByIdUseCase';
import { CancelConsultationUseCase } from '@/useCases/implementation/user/data/cancelConsultationUseCase';

//--------------- psychologist ------------------
import { VerifyPsychologistUseCase } from '../../useCases/implementation/psychologist/profile/verifyUseCase';
import { GetProfileUseCase } from '../../useCases/implementation/psychologist/profile/getProfileUseCase';
import { UpdatePsychologistProfileUseCase } from '../../useCases/implementation/psychologist/profile/updatePsychologistProfileUseCase';
import { CreateSlotUseCase } from '../../useCases/implementation/psychologist/availability/CreateSlotUseCase';
import { GetSlotByPsychologistUseCase } from '../../useCases/implementation/psychologist/availability/GetSlotByPsychologistUseCase';
import { DeleteSlotUseCase } from '../../useCases/implementation/psychologist/availability/DeleteSlotUseCase';
import { GetKycDetailsUseCase } from '../../useCases/implementation/psychologist/profile/getKycDetailsUseCase';
import { GetPsychologistConsultationUseCase } from '@/useCases/implementation/psychologist/data/getPsychologistConsultationsUseCase';
import { PsychologistCancelConsultationUseCase } from '@/useCases/implementation/psychologist/data/psychologistCancelConsultationUseCase';  

//--------------- admin -----------------
import { AdminLoginUseCase } from '../../useCases/implementation/admin/auth/loginUseCase';
import { CreateServiceUseCase } from '../../useCases/implementation/admin/management/createServiceUseCase';
import { DeleteServiceUseCase } from '@/useCases/implementation/admin/management/deleteServiceUseCase';
import { AdminLogoutUseCase } from '../../useCases/implementation/admin/auth/logoutUseCase';
import { GetAllUserUseCase } from '../../useCases/implementation/admin/management/getAllUserUseCase';
import { GetAllPsychologistsForAdminUseCase } from '../../useCases/implementation/admin/management/getAllPsychologistsForAdminUseCase';
import { ToggleUserStatusUseCase } from '../../useCases/implementation/admin/management/toggleUserStatusUseCase';
import { GetAllKycUseCase } from '../../useCases/implementation/admin/management/getAllKycUseCase';
import { GetKycForPsychologistUseCase } from '../../useCases/implementation/admin/management/getKycForPsychologistUseCase';
import { ApproveKycUseCase } from '../../useCases/implementation/admin/management/approveKycUseCase';
import { RejectKycUseCase } from '../../useCases/implementation/admin/management/rejectKycUseCase';

//--------------- chat -------------------
import { GetUserChatConsultationsUseCase } from '@/useCases/implementation/chat/getUserChatConsultationsUseCase';
import { GetPsychologistChatConsultationsUseCase } from '@/useCases/implementation/chat/getPsychologistChatConsultationsUseCase';
import { SendMessageUseCase } from '@/useCases/implementation/chat/sendMessageUseCase';
import { GetHistoryUseCase } from '@/useCases/implementation/chat/getHistoryUseCase';
import { ChatSocketHandler } from '@/presentation/socket/chatSocketHandler';
import { EnsureMembershipUseCase } from '@/useCases/implementation/chat/ensureMembershipUseCase';
import { GetUnreadCountUseCase } from '@/useCases/implementation/chat/getUnreadCountUseCase';
import { MarkReadUseCase } from '@/useCases/implementation/chat/markReadUseCase';


//===================== CONTROLLERS =====================

//---------------- user ------------------
import { AuthController } from '../../presentation/http/controllers/auth/AuthController';
import { RefreshTokenController } from '../../presentation/http/controllers/auth/RefreshTokenController';
import { ForgotPasswordController } from '@/presentation/http/controllers/auth/forgotPasswordController';
import { ChangePasswordController } from '@/presentation/http/controllers/auth/ChangePasswordController';
import { GetAllServicesController } from '../../presentation/http/controllers/user/getAllServicesController';
import { GetAllPsychologistsForUserController } from '../../presentation/http/controllers/user/getAllPsychologistsForUserController';
import { GetUserProfileController } from '../../presentation/http/controllers/user/getUserProfileController';
import { UpdateUserProfileController } from '../../presentation/http/controllers/user/updateUserProfileController';
import { GetPsychologistDetailsController } from '../../presentation/http/controllers/user/getPsychologistDetailsController';
import { GoogleLoginController } from '../../presentation/http/controllers/auth/GoogleLoginController';
import { GetSlotsForUserController } from '../../presentation/http/controllers/user/getSlotForUserController';
import { PaymentController } from '../../presentation/http/controllers/user/paymentController';
import { GetUserConsultationsController } from '../../presentation/http/controllers/user/getUserConsultationsController';
import { CreateWalletController } from '@/presentation/http/controllers/user/wallet/createWalletController';
import { GetWalletByIdController } from '@/presentation/http/controllers/user/wallet/getWalletByIdController';
import { GetWalletByUserController } from '@/presentation/http/controllers/user/wallet/getWalletByUserController';
import { CreateWalletTransactionController } from '@/presentation/http/controllers/user/wallet/createWalletTransactionController';
import { ListWalletTransactionController } from '@/presentation/http/controllers/user/wallet/listWalletTransactionController';
import { GetUserConsultationDetailController } from '@/presentation/http/controllers/user/getUserConsultationDetailController';
import { CancelConsultationController } from '@/presentation/http/controllers/user/cancelConsultationController';


//---------------- psychologist -----------------
import { VerifyPsychologistController } from '../../presentation/http/controllers/psychologist/VerifyPsychologistController';
import { GetProfileController } from '../../presentation/http/controllers/psychologist/getProfileController';
import { UpdatePsychologistProfileController } from '../../presentation/http/controllers/psychologist/updatePsychologistProfileController';
import { CreateSlotController } from '../../presentation/http/controllers/psychologist/createSlotController';
import { GetSlotByPsychologistController } from '../../presentation/http/controllers/psychologist/getSlotByPsychologistController';
import { DeleteSlotController } from '../../presentation/http/controllers/psychologist/deleteSlotController';
import { GetKycDetailsController } from '../../presentation/http/controllers/psychologist/getKycDetailsController';
import { GetPsychologistConsultationsController } from '@/presentation/http/controllers/psychologist/getPsychologistConsultationsController';
import { PsychologistCancelConsultationController } from '@/presentation/http/controllers/psychologist/psychologistCancelConsultationController';


//---------------- admin -------------------
import { AdminAuthController } from '../../presentation/http/controllers/admin/adminAuthController';
import { CreateServiceController } from '../../presentation/http/controllers/admin/createServiceController';
import { DeleteServiceController } from '@/presentation/http/controllers/admin/deleteServiceController';
import { GetAllUserController } from '../../presentation/http/controllers/admin/getAllUserController';
import { GetAllPsychologistsForAdminController } from '../../presentation/http/controllers/admin/getAllPsychologistsForAdminController';
import { ToggleUserStatusController } from '../../presentation/http/controllers/admin/toggleUserStatusController';
import { GetAllKycController } from '../../presentation/http/controllers/admin/getAllKycController';
import { GetKycForPsychologistController } from '../../presentation/http/controllers/admin/getKycForPsychologistController';
import { ApproveKycController } from '../../presentation/http/controllers/admin/approveKycController';
import { RejectKycController } from '../../presentation/http/controllers/admin/rejectKycController';

//---------------- chat -----------------------
import { GetUserChatConsultationsController } from '@/presentation/http/controllers/chat/getUserChatConsultationsController';
import { GetPsychologistChatConsultationsController } from '@/presentation/http/controllers/chat/getPsychologistChatConsultationsController';
import { SendMessageController } from '@/presentation/http/controllers/chat/sendMessageController';
import { GetHistoryController } from '@/presentation/http/controllers/chat/getHistoryController';
import { GetUnreadCountController } from '@/presentation/http/controllers/chat/getUnreadCountController';
import { MarkAsReadController } from '@/presentation/http/controllers/chat/markAsReadController';

//===================== MIDDLEWARE ========================
import { authMiddleware } from '../../presentation/http/middlewares/authMiddleware';
import { checkBlockedMiddleware } from '../../presentation/http/middlewares/checkBlockedMiddleware';
import { MessageRepository } from '../repositories/user/messageRepository';


// ======================= DI IMPLEMENTATION =======================

// ---------- SERVICES ----------
const authService = new BcryptAuthService();
export const tokenService = new JwtTokenService();
const otpRepository = new OtpRepository();
const otpService = new NodemailerOtpService(otpRepository);
const userRepository = new UserRepository();

export const authenticateUser = authMiddleware(tokenService, ['user']);
export const authenticatePsychologist = authMiddleware(tokenService, ['psychologist']);
export const authenticateAdmin = authMiddleware(tokenService, ['admin']);
export const authenticateAll = authMiddleware(tokenService, ['user', 'psychologist']);

export const checkBlockedUser = checkBlockedMiddleware(userRepository);


// ---------- user ------------

const fileStorage = new CloudinaryStorage();
const kycRepository = new KycRepository();
const googleAuthService = new GoogleAuthService();
const slotRepository = new SlotRepository();
const paymentService = new PaymentService(stripe);

const userAuthRepository = new UserAuthAccountRepository();
const userServiceRepository = new ServiceRepository();
const psychologistRepository = new PsychologistRepository();
const paymentRepository = new PaymentRepository();
const consultationRepository = new ConsultationRepository();
const walletRepository = new WalletRepository();


const signupUseCase = new SignupUseCase(userRepository, tokenService, fileStorage);
const loginUseCase = new LoginUseCase( userRepository, authService, tokenService, psychologistRepository );
const googleLoginUseCase = new GoogleLoginUseCase(tokenService,userRepository, googleAuthService, psychologistRepository, fileStorage);
const verifyForgotPasswordUseCase = new VerifyForgotPasswordUseCase(otpRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(otpRepository, userRepository, authService);
const changePasswordUseCase = new ChangePasswordUseCase(userRepository, authService);
const logoutUseCase = new LogoutUseCase();
const sendOtpUseCase = new SendOtpUseCase(otpService);
const verifyOtpUseCase = new VerifyOtpUseCase(otpService, tokenService, userRepository, authService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userAuthRepository);
const getAllServicesUseCase = new GetAllServiceUseCase(userServiceRepository);
const getAllPsychologistUseCase = new GetAllPsychologistsForUserUseCase(psychologistRepository);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository, fileStorage);
const getPsychologistDetailsUseCase = new GetPsychologistDetailsUseCase(psychologistRepository, kycRepository, userRepository);
const getSlotsForUserUseCase = new GetSlotForUserUseCase(slotRepository, psychologistRepository);
const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(paymentService, paymentRepository, slotRepository);
const handleWebhookUseCase = new HandleWebhookUseCase(paymentRepository, paymentService, consultationRepository, slotRepository, walletRepository);
const getUserConsultationsUseCase = new GetUserConsultationsUseCase(consultationRepository);
const createWalletUseCase = new CreateWalletUseCase(walletRepository);
const getWalletByIdUseCase = new GetWalletByIdUseCase(walletRepository);
const getWalletByUserUseCase = new GetWalletByUserUseCase(walletRepository);
const createWalletTransactionUseCase = new CreateWalletTransactionUseCase(walletRepository);
const listWalletTransactionsUseCase = new ListWalletTransactionsUseCase(walletRepository);
const getUserConsultationByIdUseCase = new GetUserConsultationByIdUseCase(consultationRepository);
const cancelConsultationUseCase = new CancelConsultationUseCase(walletRepository, consultationRepository, paymentRepository, slotRepository);


export const authController = new AuthController(
    signupUseCase,
    sendOtpUseCase,
    verifyOtpUseCase,
    loginUseCase,
    logoutUseCase,
);
export const forgotPasswordController = new ForgotPasswordController(verifyForgotPasswordUseCase, resetPasswordUseCase);
export const googleLoginController = new GoogleLoginController(googleLoginUseCase);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase, 'refreshToken');
export const changePasswordController = new ChangePasswordController(changePasswordUseCase);
export const userGetAllServicesController = new GetAllServicesController(getAllServicesUseCase);
export const getAllPsychologistsController = new GetAllPsychologistsForUserController(getAllPsychologistUseCase);
export const getUserProfileController = new GetUserProfileController(getUserProfileUseCase);
export const updateUserProfileController = new UpdateUserProfileController(updateUserProfileUseCase);
export const getPsychologistDetailsController = new GetPsychologistDetailsController(getPsychologistDetailsUseCase);
export const getSlotsForUserController = new GetSlotsForUserController(getSlotsForUserUseCase);
export const paymentController = new PaymentController(createCheckoutSessionUseCase, handleWebhookUseCase);
export const getUserConsultationsController = new GetUserConsultationsController(getUserConsultationsUseCase);
export const createWalletController = new CreateWalletController(createWalletUseCase);
export const getWalletByIdController = new GetWalletByIdController(getWalletByIdUseCase);
export const getWalletByUserController = new GetWalletByUserController(getWalletByUserUseCase);
export const createWalletTransactionController = new CreateWalletTransactionController(createWalletTransactionUseCase);
export const listWalletTransactionController = new ListWalletTransactionController(listWalletTransactionsUseCase);
export const getUserConsultationDetailController = new GetUserConsultationDetailController(getUserConsultationByIdUseCase);
export const cancelConsultationController = new CancelConsultationController(cancelConsultationUseCase);


// ---------- PSYCHOLOGIST ----------

const verifyPsychologistUseCase = new VerifyPsychologistUseCase(psychologistRepository, kycRepository, fileStorage);
const getProfileUseCase = new GetProfileUseCase(psychologistRepository, kycRepository, userRepository);
const updatePsychologistProfileUseCase = new UpdatePsychologistProfileUseCase(psychologistRepository, userRepository, fileStorage);
const createSlotUseCase = new CreateSlotUseCase(slotRepository, psychologistRepository);
const getSlotByPsychologistUseCase = new GetSlotByPsychologistUseCase(slotRepository, psychologistRepository);
const deleteSlotUseCase = new DeleteSlotUseCase(slotRepository, psychologistRepository);
const getKycDetailsUseCase = new GetKycDetailsUseCase(kycRepository, psychologistRepository);
const getPsychologistConsultationsUseCase = new GetPsychologistConsultationUseCase(consultationRepository, psychologistRepository);
const psychologistCancelConsultationUseCase = new PsychologistCancelConsultationUseCase(walletRepository, consultationRepository, paymentRepository, slotRepository, psychologistRepository);

export const verifyPsychologistController = new VerifyPsychologistController(verifyPsychologistUseCase);
export const getProfileController = new GetProfileController(getProfileUseCase);
export const updatePsychologistProfileController = new UpdatePsychologistProfileController(updatePsychologistProfileUseCase);
export const createSlotController = new CreateSlotController(createSlotUseCase);
export const getSlotByPsychologistController = new GetSlotByPsychologistController(getSlotByPsychologistUseCase);
export const deleteSlotController = new DeleteSlotController(deleteSlotUseCase);
export const getKycDetailsController = new GetKycDetailsController(getKycDetailsUseCase);
export const getPsychologistConsultationsController = new GetPsychologistConsultationsController(getPsychologistConsultationsUseCase);
export const psychologistCancelConsultationController = new PsychologistCancelConsultationController(psychologistCancelConsultationUseCase);


// ---------- ADMIN ----------

const adminRepository = new AdminRepository();
const adminAuthRepository = new AdminAuthAccountRepository();
const adminRefreshTokenUseCase = new RefreshTokenUseCase(tokenService, adminAuthRepository);
const adminLoginUseCase = new AdminLoginUseCase(adminRepository, tokenService, authService);
const adminLogoutUseCase = new AdminLogoutUseCase();
const serviceRepository = new ServiceRepository();
const createServiceUseCase = new CreateServiceUseCase(serviceRepository, fileStorage);
const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository);
const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const getAllPsychologistsUseCase = new GetAllPsychologistsForAdminUseCase(psychologistRepository);
const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userRepository);
const getAllKycUseCase = new GetAllKycUseCase(kycRepository);
const getKycForPsychologistUseCase = new GetKycForPsychologistUseCase(kycRepository);
const approveKycUseCase = new ApproveKycUseCase(kycRepository,psychologistRepository);
const rejectKycUseCase = new RejectKycUseCase(kycRepository,psychologistRepository);


export const adminAuthController = new AdminAuthController(adminLoginUseCase, adminLogoutUseCase);
export const adminRefreshTokenController  = new RefreshTokenController(adminRefreshTokenUseCase, 'adminRefreshToken');
export const createServiceController = new CreateServiceController(createServiceUseCase);
export const deleteServiceController = new DeleteServiceController(deleteServiceUseCase);
export const getAllUserController = new GetAllUserController(getAllUserUseCase);
export const getAllPsychologistController = new GetAllPsychologistsForAdminController(getAllPsychologistsUseCase); 
export const toggleUserStatusController = new ToggleUserStatusController(toggleUserStatusUseCase);
export const getAllKycController = new GetAllKycController(getAllKycUseCase);
export const getKycForPsychologistController = new GetKycForPsychologistController(getKycForPsychologistUseCase);
export const approveKycController = new ApproveKycController(approveKycUseCase);
export const rejectKycController = new RejectKycController(rejectKycUseCase);

//--------------- chat -----------------------

const messageRepository = new MessageRepository();

const getUserChatConsultationsUseCase = new GetUserChatConsultationsUseCase(consultationRepository);
const getPsychologistChatConsultationsUseCase = new GetPsychologistChatConsultationsUseCase(consultationRepository, psychologistRepository);
const ensureMembershipUseCase = new EnsureMembershipUseCase(consultationRepository, psychologistRepository);
const sendMessageUseCase = new SendMessageUseCase(messageRepository, ensureMembershipUseCase);
const getHistoryUseCase = new GetHistoryUseCase(messageRepository);
const getUnreadCountUseCase = new GetUnreadCountUseCase(messageRepository, userRepository, psychologistRepository);
const markReadUseCase = new MarkReadUseCase(messageRepository, psychologistRepository, userRepository);

export const getUserChatConsultationsController = new GetUserChatConsultationsController(getUserChatConsultationsUseCase);
export const getPsychologistChatConsultationsController = new GetPsychologistChatConsultationsController(getPsychologistChatConsultationsUseCase);
export const sendMessageController = new SendMessageController(sendMessageUseCase);
export const getHistoryController = new GetHistoryController(getHistoryUseCase);
export const getUnreadCountController = new GetUnreadCountController(getUnreadCountUseCase);
export const markAsReadController = new MarkAsReadController(markReadUseCase);

// socket handler
export const chatSocketHandler = new ChatSocketHandler(sendMessageUseCase, markReadUseCase);