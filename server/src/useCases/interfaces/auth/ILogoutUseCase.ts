import { Request, Response } from 'express';

export interface ILogoutUseCase {
    execute(req: Request, res: Response): Promise<void>;
}