import dotenv from 'dotenv';
dotenv.config();
import { MongoUserRepository } from "../infrastructure/repositories/userRepository";
import { MongoOtpRepository } from '../infrastructure/repositories/otpRepository';
import { BcryptAuthService } from "../infrastructure/auth/authService";
import { JwtTokenService } from "../infrastructure/auth/tokenService";
import { NodemailerOtpService } from '../infrastructure/auth/otpService';

import { SignupUseCase } from "../useCases/signup/signupUseCase";
import { SendOtpUseCase } from '../useCases/signup/sendOtpUseCase';
import { VerifyOtpUseCase } from '../useCases/signup/verifyOtpUseCase';

import { AuthController } from "../interface/http/controllers/authController";


// infrastructure
const userRepository = new MongoUserRepository()
const otpRepository = new MongoOtpRepository()
const authService = new BcryptAuthService()
const tokenService = new JwtTokenService()
const otpService = new NodemailerOtpService(otpRepository)


// useCases
const signupUseCase = new SignupUseCase(userRepository, authService, tokenService, otpService)
const sendOtpUseCase = new SendOtpUseCase(otpService)
const verifyOtpUseCase = new VerifyOtpUseCase(otpService)

// controllers
export const authController = new AuthController(signupUseCase, sendOtpUseCase, verifyOtpUseCase)