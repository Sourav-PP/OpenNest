import { Request, Response, NextFunction } from 'express';
import { ICreateVideoCallUseCase } from '@/useCases/interfaces/videoCall/ICreateVideoCallUseCase';
import { IStartVideoCallUseCase } from '@/useCases/interfaces/videoCall/IStartVideoCallUseCase';
import { IEndVideoCallUseCase } from '@/useCases/interfaces/videoCall/IEndVideoCallUseCase';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { videoCallMessages } from '@/shared/constants/messages/videoCallMessages';

export class VideoCallController {
    private _createVideoCallUseCase: ICreateVideoCallUseCase;
    private _startVideoCallUseCase: IStartVideoCallUseCase;
    private _endVideoCallUseCase: IEndVideoCallUseCase;

    constructor(
        createVideoCallUseCase: ICreateVideoCallUseCase,
        startVideoCallUseCase: IStartVideoCallUseCase,
        endVideoCallUseCase: IEndVideoCallUseCase,
    ) {
        this._createVideoCallUseCase = createVideoCallUseCase;
        this._startVideoCallUseCase = startVideoCallUseCase;
        this._endVideoCallUseCase = endVideoCallUseCase;
    }

    schedule = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { consultationId, patientId, psychologistId } = req.body;

            const call = await this._createVideoCallUseCase.execute(
                consultationId,
                patientId,
                psychologistId,
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: videoCallMessages.SUCCESS.SCHEDULED,
                data: call,
            });
        } catch (error) {
            next(error);
        }
    };

    start = async(
        req: Request, 
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { consultationId } = req.body;
            
            const call = await this._startVideoCallUseCase.execute(consultationId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: videoCallMessages.SUCCESS.STARTED,
                data: call,
            });
        } catch (error) {
            next(error);
        }
    };

    end = async(
        req: Request, 
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { consultationId } = req.body;
            const call = await this._endVideoCallUseCase.execute(consultationId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: videoCallMessages.SUCCESS.ENDED,
                data: call,
            });
        } catch (error) {
            next(error);
        }
    };
}
