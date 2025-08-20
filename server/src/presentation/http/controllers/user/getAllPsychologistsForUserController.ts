import { NextFunction, Request, Response } from 'express';
import { IGetAllPsychologistsForUserUseCase } from '@/useCases/interfaces/signup/IGetAllPsychologistsForUserUseCase';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';

export class GetAllPsychologistsForUserController {
    private _getAllPsychologistUseCase: IGetAllPsychologistsForUserUseCase;

    constructor(getAllPsychologistUseCase: IGetAllPsychologistsForUserUseCase) {
        this._getAllPsychologistUseCase = getAllPsychologistUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllPsychologistUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                gender: req.query.gender as 'Male' | 'Female' | 'all',
                expertise: req.query.expertise as string,
                page,
                limit,
            });

            console.log('result: ', result);
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
}