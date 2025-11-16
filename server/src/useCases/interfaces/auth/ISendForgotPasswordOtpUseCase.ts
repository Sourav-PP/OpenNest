export interface ISendForgotPasswordOtpUseCase {
    execute(email: string): Promise<void>;
}