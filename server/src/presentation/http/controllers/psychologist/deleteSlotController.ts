import { Request, Response } from 'express';
import { DeleteSlotUseCase } from '../../../../useCases/implementation/psychologist/availability/DeleteSlotUseCase';
import { IPsychologistRepository } from '../../../../domain/interfaces/IPsychologistRepository';
import { AppError } from '../../../../domain/errors/AppError';

export class DeleteSlotController {
    constructor(
        private deleteSlotUseCase: DeleteSlotUseCase,
        private psychologistRepo: IPsychologistRepository,
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const { slotId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success:false, message: 'Invalid token, please login again' });
                return;
            }

            const psychologist = await this.psychologistRepo.findByUserId(userId);
            if (!psychologist) {
                res.status(409).json({ success:false, message: 'Psychologist not found' });
                return;
            }

            await this.deleteSlotUseCase.execute({ slotId, psychologistId: psychologist.id! });

            res.status(200).json({ success: true, message: 'Slot deleted successfully' });
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}
