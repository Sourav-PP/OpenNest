import { Request, Response } from "express";
import { SignupUseCase } from "../../../useCases/signup/signupUseCase";
import { SignupRequest } from "../../../useCases/signup/signupTypes";
import { SendOtpUseCase } from "../../../useCases/signup/sendOtpUseCase";
import { VerifyOtpUseCase } from "../../../useCases/signup/verifyOtpUseCase";
import { LoginUseCase } from "../../../useCases/login/loginUseCase";

export class AuthController {
  constructor(
    private signupUseCase: SignupUseCase,
    private sendOtpUseCase: SendOtpUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private loginUseCase: LoginUseCase
  ) {}

  sendOtp = async(req: Request, res: Response): Promise<void> => {
    await this.sendOtpUseCase.execute(req.body.email)
    res.status(200).json({ message: 'OTP sent' });
    return
  }

  verifyOtp = async(req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return 
    }
    const isValid = await this.verifyOtpUseCase.execute(req.body.email, req.body.otp);
    if (!isValid) {
      res.status(400).json({ message: 'Invalid OTP' });
      return
    }
    res.status(200).json({ message: 'OTP verified' });
    return 
  }

  signup = async(req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.signupUseCase.execute(req.body);

      // set refresh token as http-only cookie
      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        user: response.user,
        accessToken: response.accessToken,
      });
    } catch (error: any) {
      const statusCode = error.statusCode | 500
      const message = error.message || "Internal server error"
      res.status(statusCode).json({ error: message });
    }
  }

  login = async(req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.loginUseCase.execute(req.body)

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Login successfull",
        user: response.user,
        accessToken: response.accessToken,
      });
    } catch (error: any) {
      const statusCode = error.statusCode ||   500
      const message = error.message || "Internal server error"
      res.status(statusCode).json({ error: message });
    }
  }
}
