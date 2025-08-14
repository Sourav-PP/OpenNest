import { Request, Response } from 'express';
import { ToggleUserStatusUseCase } from '../../../../useCases/implementation/admin/management/toggleUserStatusUseCase';

export class ToggleUserStatusController {
    constructor(private toggleUserStatusUseCase: ToggleUserStatusUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        const userId = req.params.userId;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return; 
        }

        try {
            await this.toggleUserStatusUseCase.execute(userId, status);
            res.status(200).json({ message: `User ${status} successfully` });
            return; 
        } catch (error: any) {
            res.status(500).json({ message: error.message });
            return;
        }
    };
}