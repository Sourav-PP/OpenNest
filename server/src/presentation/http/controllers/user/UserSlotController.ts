import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetSlotForUserUseCase } from '@/useCases/interfaces/user/data/IGetSlotForUserUseCase';
import { NextFunction, Request, Response } from 'express';

export class UserSlotController {
    private _getSlotsForUserUseCase: IGetSlotForUserUseCase;

    constructor(getSlotsForUserUseCase: IGetSlotForUserUseCase) {
        this._getSlotsForUserUseCase = getSlotsForUserUseCase;
    }

    getAllSlots = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            const date = req.query.date ? new Date(req.query.date as string) : undefined;

            const slots = await this._getSlotsForUserUseCase.execute({
                userId,
                date,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_SLOTS,
                data: slots.map(slot => ({
                    ...slot,
                    isExpired: new Date(slot.endDateTime).getTime() <= Date.now(),
                })),
            });
        } catch (error) {
            next(error);
        }
    };
}
