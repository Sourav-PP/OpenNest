export interface IVerifyForgotPasswordUseCase {
  execute(email: string, otp: string): Promise<boolean>
}