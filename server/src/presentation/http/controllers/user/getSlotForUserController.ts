import { Request, Response } from 'express';
import { IGetSlotForUserUseCase } from '../../../../useCases/interfaces/user/data/IGetSlotForUserUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class GetSlotsForUserController {
    constructor(
        private getSlotsForUserUseCase: IGetSlotForUserUseCase,
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const date = req.query.date ? new Date(req.query.date as string) : undefined;

            const slots = await this.getSlotsForUserUseCase.execute({ userId, date });
            res.status(200).json(slots);
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }

    };
}