import { Request, Response } from "express";
import { SignupUseCase } from "../../../../useCases/implementation/signup/signupUseCase";
import { SendOtpUseCase } from "../../../../useCases/implementation/signup/sendOtpUseCase";
import { VerifyOtpUseCase } from "../../../../useCases/implementation/signup/verifyOtpUseCase";
import { LoginUseCase } from "../../../../useCases/implementation/auth/loginUseCase";
import { LogoutUseCase } from "../../../../useCases/implementation/auth/logoutUseCase";
import { AppError } from "../../../../domain/errors/AppError";
import { uploadToCloudinary } from "../../../../utils/uploadToCloudinary";

export class AuthController {
  constructor(
    private signupUseCase: SignupUseCase,
    private sendOtpUseCase: SendOtpUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private loginUseCase: LoginUseCase,
    private logoutUseCase: LogoutUseCase
  ) {}

  sendOtp = async(req: Request, res: Response): Promise<void> => {
    try {
      console.log("its here in sendOtp")
      console.log('email: ',req.body.email)
      await this.sendOtpUseCase.execute(req.body.email)
      res.status(200).json({ message: 'OTP sent' });
      return
    } catch (error) {
      console.log("error in send otp: ", error)
    }
  }

  verifyOtp = async(req: Request, res: Response): Promise<void> => {
    console.log("verifyyyyyyyyyyyyy")
    const { email, otp, signupToken } = req.body;
    console.log("otp in fdkfndofn: ", otp)

    console.log("signupToken:", signupToken)

    if (!email || !otp || !signupToken){
      res.status(400).json({ message: 'Email and OTP are required' });
      return 
    }

    const response = await this.verifyOtpUseCase.execute(email, otp, signupToken);

    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(200).json({
      accessToken: response.accessToken,
      user: response.user
    });
    return 
  }

  signup = async(req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file

      if(!file) {
        res.status(400).json({message: "Profile image is required"})
        return
      }

      const cloudUrl = await uploadToCloudinary(file.buffer, file.originalname, "profile_images")

      const payload = {
        ...req.body,
        profileImage: cloudUrl
      }
      const signupToken = await this.signupUseCase.execute(payload);
      console.log("signup token in backend: ", signupToken)

      // // set refresh token as http-only cookie
      // res.cookie("refreshToken", response.refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      res.status(201).json({signupToken});
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
        hasSubmittedVerificationForm: response.hasSubmittedVerificationForm
      });
    } catch (error: any) {
      const statusCode = error.statusCode ||   500
      const message = error.message || "Internal server error"
      res.status(statusCode).json({ error: message });
    }
  }

  logout = async(req: Request, res: Response): Promise<void> => {
    try {
        await this.logoutUseCase.execute(req, res)
        res.status(200).json({message: "logout successful"})
    } catch (error: any) {
        const status = error instanceof AppError ? error.statusCode : 500
        const message = error.message || "Internal server error";
        console.log("its here", message, status)
        res.status(status).json({ message });
    }
  }
}
