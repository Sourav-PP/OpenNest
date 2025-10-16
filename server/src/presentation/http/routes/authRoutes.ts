import express from 'express';
import { signupValidator, validate } from '../validators/signupValidator';
import { loginValidate, loginValidator } from '../validators/loginValidator';
import { verifyPsychologistValidator, validateVerifyPsychologist } from '../validators/verifyPsychologistValidator';
import { validateFiles } from '../validators/validateFiles';
import {
    authenticatePsychologist,
    authController,
    googleLoginController,
    refreshTokenController,
    forgotPasswordController,
    authenticateAll,
    changePasswordController,
    psychologistKycController,
} from '@/infrastructure/config/di';

import { uploadFields, uploadSingle } from '../middlewares/multer';

const router = express.Router();


router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/signup', uploadSingle, signupValidator, validate, authController.signup);
router.post('/login', loginValidator, loginValidate, authController.login);
router.post('/google-login', googleLoginController.handle);
router.post('/logout', authController.logout);
router.post('/refresh-token', refreshTokenController.handle);
router.post('/forgot/verify-otp', forgotPasswordController.verifyOtp);
router.post('/forgot/reset-password', forgotPasswordController.resetPassword);
router.put('/change-password', authenticateAll, changePasswordController.handle);
router.post(
    '/psychologist/verify-profile',
    authenticatePsychologist,
    uploadFields(['identificationDoc', 'educationalCertification', 'experienceCertificate']),
    verifyPsychologistValidator,
    validateVerifyPsychologist,
    validateFiles,
    psychologistKycController.verifyPsychologist,
);

export default router;
