import { Request, Response } from 'express';

export interface IAdminLogoutUseCase {
    execute(req: Request, res: Response): Promise<void>;
}