import Stripe from 'stripe';
import { appConfig } from './config';

const stripe = new Stripe(appConfig.stripe.secretKey, {
    apiVersion:  '2025-07-30.basil',
});

const baseUrl = appConfig.server.frontendUrl;

// ====================   REPOSITORIES  ======================

// --------------  user  ----------------
import { UserRepository } from '../repositories/user/userRepository';
import { UserAuthAccountRepository } from '../repositories/user/userAuthAccountRepository';
import { OtpRepository } from '../repositories/user/otpRepository';
import { PaymentRepository } from '../repositories/user/paymentRepository';
import { ConsultationRepository } from '../repositories/user/consultationRepository';
import { CloudinaryStorage } from '../fileStorage/cloudinaryStorage';
import { WalletRepository } from '../repositories/user/walletRepository';
import { VideoCallRepository } from '../repositories/user/videoCallRepository';

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
import { VideoCallService } from '../services/videoCallService';


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
import { GetAllConsultationsUseCase } from '@/useCases/implementation/admin/management/getAllConsultationUseCase';

//--------------- chat -------------------
import { GetUserChatConsultationsUseCase } from '@/useCases/implementation/chat/getUserChatConsultationsUseCase';
import { GetPsychologistChatConsultationsUseCase } from '@/useCases/implementation/chat/getPsychologistChatConsultationsUseCase';
import { SendMessageUseCase } from '@/useCases/implementation/chat/sendMessageUseCase';
import { GetHistoryUseCase } from '@/useCases/implementation/chat/getHistoryUseCase';
import { ChatSocketHandler } from '@/presentation/socket/chatSocketHandler';
import { EnsureMembershipUseCase } from '@/useCases/implementation/chat/ensureMembershipUseCase';
import { GetUnreadCountUseCase } from '@/useCases/implementation/chat/getUnreadCountUseCase';
import { MarkReadUseCase } from '@/useCases/implementation/chat/markReadUseCase';

//--------------videoCall--------------------
import { VideoCallSocketHandler } from '@/presentation/socket/videoCallSocketHandler';
import { StartVideoCallUseCase } from '@/useCases/implementation/videoCall/startVideoCallUseCase';
import { EndVideoCallUseCase } from '@/useCases/implementation/videoCall/endVideoCallUseCase';

//===================== CONTROLLERS =====================

//---------------- user ------------------
import { UserConsultationController } from '@/presentation/http/controllers/user/UserConsultationController';
import { UserPsychologistController } from '@/presentation/http/controllers/user/UserPsychologistController';
import { UserProfileController } from '@/presentation/http/controllers/user/UserProfileController';
import { UserServiceController } from '@/presentation/http/controllers/user/UserServiceController';
import { UserSlotController } from '@/presentation/http/controllers/user/UserSlotController';
import { UserWalletController } from '@/presentation/http/controllers/user/UserWalletController';

import { AuthController } from '../../presentation/http/controllers/auth/AuthController';
import { RefreshTokenController } from '../../presentation/http/controllers/auth/RefreshTokenController';
import { ForgotPasswordController } from '@/presentation/http/controllers/auth/forgotPasswordController';
import { ChangePasswordController } from '@/presentation/http/controllers/auth/ChangePasswordController';
import { GoogleLoginController } from '../../presentation/http/controllers/auth/GoogleLoginController';
import { PaymentController } from '../../presentation/http/controllers/user/paymentController';



//---------------- psychologist -----------------
import { SlotController } from '@/presentation/http/controllers/psychologist/SlotController';
import { PsychologistConsultationController } from '@/presentation/http/controllers/psychologist/PsychologistConsultationController';
import { PsychologistProfileController } from '@/presentation/http/controllers/psychologist/PsychologistProfileController';
import { PsychologistKycController } from '@/presentation/http/controllers/psychologist/PsychologistKycController';

//---------------- admin -------------------
import { AdminKycController } from '@/presentation/http/controllers/admin/AdminKycController';
import { AdminUserManagementController } from '@/presentation/http/controllers/admin/AdminUserManagementController';
import { AdminServiceController } from '@/presentation/http/controllers/admin/AdminServiceController';
import { AdminConsultationController } from '@/presentation/http/controllers/admin/AdminConsultationController';
import { AdminAuthController } from '../../presentation/http/controllers/admin/adminAuthController';

//---------------- chat -----------------------
import { ChatMessageController } from '@/presentation/http/controllers/chat/ChatMessageController';

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
const videoCallService = new VideoCallService(baseUrl);

const userAuthRepository = new UserAuthAccountRepository();
const userServiceRepository = new ServiceRepository();
const psychologistRepository = new PsychologistRepository();
const paymentRepository = new PaymentRepository();
const consultationRepository = new ConsultationRepository();
const walletRepository = new WalletRepository();
const videoCallRepository = new VideoCallRepository();


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
const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(paymentService, paymentRepository, slotRepository, consultationRepository);
const handleWebhookUseCase = new HandleWebhookUseCase(paymentRepository, paymentService, consultationRepository, slotRepository, walletRepository, videoCallService, videoCallRepository);
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

export const userConsultationController = new UserConsultationController(getUserConsultationsUseCase, getUserConsultationByIdUseCase, cancelConsultationUseCase);
export const userPsychologistController = new UserPsychologistController(getAllPsychologistUseCase, getPsychologistDetailsUseCase);
export const userProfileController = new UserProfileController(getUserProfileUseCase, updateUserProfileUseCase);
export const userServiceController = new UserServiceController(getAllServicesUseCase);
export const userSlotController = new UserSlotController(getSlotsForUserUseCase);
export const userWalletController = new UserWalletController(createWalletUseCase, createWalletTransactionUseCase, getWalletByIdUseCase, getWalletByUserUseCase, listWalletTransactionsUseCase);

export const forgotPasswordController = new ForgotPasswordController(verifyForgotPasswordUseCase, resetPasswordUseCase);
export const googleLoginController = new GoogleLoginController(googleLoginUseCase);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase, 'refreshToken');
export const changePasswordController = new ChangePasswordController(changePasswordUseCase);
export const paymentController = new PaymentController(createCheckoutSessionUseCase, handleWebhookUseCase);


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

export const slotController = new SlotController(createSlotUseCase, deleteSlotUseCase, getSlotByPsychologistUseCase);
export const psychologistConsultationController = new PsychologistConsultationController(getPsychologistConsultationsUseCase, psychologistCancelConsultationUseCase);
export const psychologistProfileController = new PsychologistProfileController(getProfileUseCase, updatePsychologistProfileUseCase);
export const psychologistKycController = new PsychologistKycController(getKycDetailsUseCase, verifyPsychologistUseCase);

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
const getAllConsultationsUseCase = new GetAllConsultationsUseCase(consultationRepository);

export const adminKycController = new AdminKycController(getAllKycUseCase, getKycForPsychologistUseCase, approveKycUseCase, rejectKycUseCase);
export const adminUserManagementController = new AdminUserManagementController(getAllUserUseCase, getAllPsychologistsUseCase, toggleUserStatusUseCase);
export const adminServiceController = new AdminServiceController(createServiceUseCase, deleteServiceUseCase);
export const adminConsultationController = new AdminConsultationController(getAllConsultationsUseCase);
export const adminAuthController = new AdminAuthController(adminLoginUseCase, adminLogoutUseCase);
export const adminRefreshTokenController  = new RefreshTokenController(adminRefreshTokenUseCase, 'adminRefreshToken');

//--------------- chat -----------------------

const messageRepository = new MessageRepository();

const getUserChatConsultationsUseCase = new GetUserChatConsultationsUseCase(consultationRepository);
const getPsychologistChatConsultationsUseCase = new GetPsychologistChatConsultationsUseCase(consultationRepository, psychologistRepository);
const ensureMembershipUseCase = new EnsureMembershipUseCase(consultationRepository, psychologistRepository);
const sendMessageUseCase = new SendMessageUseCase(messageRepository, ensureMembershipUseCase);
const getHistoryUseCase = new GetHistoryUseCase(messageRepository);
const getUnreadCountUseCase = new GetUnreadCountUseCase(messageRepository, userRepository, psychologistRepository);
const markReadUseCase = new MarkReadUseCase(messageRepository, psychologistRepository, userRepository);

export const chatMessageController = new ChatMessageController(sendMessageUseCase, getHistoryUseCase, getUnreadCountUseCase, markReadUseCase, getUserChatConsultationsUseCase, getPsychologistChatConsultationsUseCase);

//----------------video call--------------------

const startVideoCallUseCase = new StartVideoCallUseCase(videoCallRepository);
const endVideoCallUseCase = new EndVideoCallUseCase(videoCallRepository, consultationRepository);

// socket handler
export const chatSocketHandler = new ChatSocketHandler(sendMessageUseCase, markReadUseCase);
export const videoCallSocketHandler = new VideoCallSocketHandler(startVideoCallUseCase, endVideoCallUseCase, consultationRepository, videoCallRepository, psychologistRepository);