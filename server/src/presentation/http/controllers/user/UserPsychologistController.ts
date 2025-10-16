import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { UserGenderFilter } from '@/domain/enums/UserEnums';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetAllPsychologistsForUserUseCase } from '@/useCases/interfaces/signup/IGetAllPsychologistsForUserUseCase';
import { IGetPsychologistDetailsUseCase } from '@/useCases/interfaces/user/data/IGetPsychologistDetailsUseCase';
import { NextFunction, Request, Response } from 'express';

export class UserPsychologistController {
    private _getAllPsychologistUseCase: IGetAllPsychologistsForUserUseCase;
    private _getPsychologistDetails: IGetPsychologistDetailsUseCase;

    constructor(
        getAllPsychologistUseCase: IGetAllPsychologistsForUserUseCase,
        getPsychologistDetails: IGetPsychologistDetailsUseCase,
    ) {
        this._getAllPsychologistUseCase = getAllPsychologistUseCase;
        this._getPsychologistDetails = getPsychologistDetails;
    }

    getAllPsychologists = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllPsychologistUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                gender: req.query.gender as UserGenderFilter,
                expertise: req.query.expertise as string,
                page,
                limit,
            });

            const { psychologists, totalCount } = {
                psychologists: result.psychologists,
                totalCount: result.totalCount,
            };
            
            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_PSYCHOLOGISTS,
                data: {
                    psychologists,
                    totalCount,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    getPsychologistDetails = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;

            if (!userId) {
                throw new AppError(adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const psychologist = await this._getPsychologistDetails.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_PSYCHOLOGIST,
                data: {
                    psychologist,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}
