import express from 'express'
import { signupValidator, validate } from '../validators/signupValidator';
import { loginValidate, loginValidator } from '../validators/loginValidator';

import { authController } from '../../../config/di';
import { refreshTokenController } from '../../../config/di';
const router = express.Router()

router.post('/send-otp', authController.sendOtp)
router.post('/verify-otp', authController.verifyOtp)
router.post('/signup', signupValidator, validate, authController.signup)
router.post('/login', loginValidator, loginValidate, authController.login)
router.post('/refresh-token', refreshTokenController.handle)

export default router