export interface IRefreshTokenUseCase {
    execute(refreshToken: string): Promise<string>;
}