import express, { NextFunction, Request, Response } from 'express'
import { signupValidator, validate } from '../validators/signupValidator';
import { loginValidate, loginValidator } from '../validators/loginValidator';
import { verifyPsychologistValidator, validateVerifyPsychologist } from '../validators/verifyPsychologistValidator';
import { validateFiles } from '../validators/validateFiles';

import { authenticatePsychologist } from '../../../config/di';

import { authController } from '../../../config/di';
import { refreshTokenController } from '../../../config/di';
import { verifyPsychologistController } from '../../../config/di';
import { uploadFields, uploadSingle } from '../middlewares/multer';


const router = express.Router()

// const loggerMiddleware = (label: string) => (req: Request, res: Response, next: NextFunction  ) => {
//   console.log(`>> Hit: ${label}`);
//   next();
// };

router.post('/send-otp', authController.sendOtp)
router.post('/verify-otp', authController.verifyOtp)
router.post('/signup',uploadSingle, signupValidator, validate, authController.signup)
router.post('/login', loginValidator, loginValidate, authController.login)
router.post('/logout', authController.logout)
router.post('/refresh-token', refreshTokenController.handle)

router.post('/psychologist/verify-profile',
    authenticatePsychologist,
    uploadFields(['identificationDoc', 'educationalCertification', 'experienceCertificate']),
    verifyPsychologistValidator,
    validateVerifyPsychologist,
    validateFiles,
    verifyPsychologistController.handle,
)

export default router