import { ConsultationStatusFilter } from '@/domain/enums/ConsultationEnums';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { sessionMessages } from '@/shared/constants/messages/sessionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPatientConsultationHistoryUseCase } from '@/useCases/interfaces/psychologist/data/IGetPatientConsultationHistoryUseCase';
import { IGetPsychologistConsultationHistoryUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistConsultationHistoryUseCase';
import { IGetPsychologistConsultationUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistConsultationsUseCase';
import { IPsychologistCancelConsultationUseCase } from '@/useCases/interfaces/psychologist/data/IPsychologistCancelConsultationUseCase';
import { IUpdateConsultationNotesUseCase } from '@/useCases/interfaces/psychologist/data/IUpdateConsultationNotesUseCase';
import { NextFunction, Request, Response } from 'express';

export class PsychologistConsultationController {
    private _getPsychologistConsultationUseCase: IGetPsychologistConsultationUseCase;
    private _psychologistCancelConsultationUseCase: IPsychologistCancelConsultationUseCase;
    private _getPsychologistConsultationHistoryUseCase: IGetPsychologistConsultationHistoryUseCase;
    private _getPatientConsultationHistoryUseCase: IGetPatientConsultationHistoryUseCase;
    private _updateConsultationNotesUseCase: IUpdateConsultationNotesUseCase;

    constructor(
        getPsychologistConsultationUseCase: IGetPsychologistConsultationUseCase,
        psychologistCancelConsultationUseCase: IPsychologistCancelConsultationUseCase,
        getPsychologistConsultationHistoryUseCase: IGetPsychologistConsultationHistoryUseCase,
        getPatientConsultationHistoryUseCase: IGetPatientConsultationHistoryUseCase,
        updateConsultationNotesUseCase: IUpdateConsultationNotesUseCase,
    ) {
        this._getPsychologistConsultationUseCase = getPsychologistConsultationUseCase;
        this._psychologistCancelConsultationUseCase = psychologistCancelConsultationUseCase;
        this._getPsychologistConsultationHistoryUseCase = getPsychologistConsultationHistoryUseCase;
        this._getPatientConsultationHistoryUseCase = getPatientConsultationHistoryUseCase;
        this._updateConsultationNotesUseCase = updateConsultationNotesUseCase;
    }

    getConsultations = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const result = await this._getPsychologistConsultationUseCase.execute({
                psychologistId: userId,
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                status: req.query.status as ConsultationStatusFilter,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    cancelConsultation = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { consultationId } = req.params;
            const { reason } = req.body;

            const consultation = await this._psychologistCancelConsultationUseCase.execute(
                userId,
                consultationId,
                reason,
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: sessionMessages.SUCCESS.CANCELLED,
                data: consultation,
            });
        } catch (error) {
            next(error);
        }
    };

    getHistory = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const result = await this._getPsychologistConsultationHistoryUseCase.execute({
                psychologistId: userId,
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getPatientHistory = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const { patientId } = req.params;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const result = await this._getPatientConsultationHistoryUseCase.execute({
                patientId,
                psychologistUserId: userId,
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    updateNotes = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { consultationId } = req.params;
            const { privateNotes, feedback } = req.body;

            const result = await this._updateConsultationNotesUseCase.execute({
                consultationId,
                userId,
                privateNotes,
                feedback,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: psychologistMessages.SUCCESS.NOTES_SENT,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}
