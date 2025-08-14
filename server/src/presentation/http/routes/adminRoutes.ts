import express from 'express';
import { uploadSingle } from '../middlewares/multer';

//validators
import { loginValidate, loginValidator } from '../validators/loginValidator';
import { createServiceValidator, validateCreateService } from '../validators/createServiceValidator';

//controllers
import {
    adminAuthController,
    getAllUserController,
    createServiceController,
    adminRefreshTokenController,
    getAllPsychologistController,
    toggleUserStatusController,
    getAllKycController,
    authenticateAdmin,
    getKycForPsychologistController,
    approveKycController,
    rejectKycController,
} from '../../../config/di';



const router = express.Router();

// const loggerMiddleware = (label: string) => (req: Request, res: Response, next: NextFunction  ) => {
//   console.log(`>> Hit: ${label}`);
//   next();
// };


router.post(
    '/login',
    loginValidator,
    loginValidate,
    adminAuthController.login,
);
router.post(
    '/logout',
    adminAuthController.logout,
);
router.post('/refresh-token', adminRefreshTokenController.handle);
router.post(
    '/services',
    uploadSingle,
    createServiceValidator,
    validateCreateService,
    createServiceController.handle,
);
router.get('/users', authenticateAdmin,  getAllUserController.handle);
router.get('/psychologists', authenticateAdmin, getAllPsychologistController.handle);
router.get('/kyc', authenticateAdmin, getAllKycController.handle);
router.get('/kyc/:psychologistId', authenticateAdmin, getKycForPsychologistController.handle);
router.patch('/kyc/:psychologistId/approve', authenticateAdmin, approveKycController.handle);
router.patch('/kyc/:psychologistId/reject', authenticateAdmin, rejectKycController.handle);
router.patch('/users/:userId/status', authenticateAdmin, toggleUserStatusController.handle);


export default router;
