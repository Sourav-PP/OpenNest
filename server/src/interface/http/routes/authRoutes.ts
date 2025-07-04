import express from 'express'
import { signupValidator, validate } from '../validators/signupValidator';
import { authController } from '../../../config/di';
const router = express.Router()

router.post('/send-otp', authController.sendOtp)
router.post('/verify-otp', authController.verifyOtp)
router.post('/signup', signupValidator, validate, authController.signup)
// router.post('/login', login)

export default router