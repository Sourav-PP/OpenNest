import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { UserGender } from '@/domain/enums/UserEnums';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetAllPsychologistsForAdminUseCase } from '@/useCases/interfaces/admin/management/IGetAllPsychologistsForAdminUseCase';
import { IGetAllUserUseCase } from '@/useCases/interfaces/admin/management/IGetAllUsersUseCase';
import { IToggleUserStatusUseCase } from '@/useCases/interfaces/admin/management/IToggleUserStatusUseCase';
import { NextFunction, Request, Response } from 'express';

export class AdminUserManagementController {
    private _getAllUserUseCase: IGetAllUserUseCase;
    private _getAllPsychologistsUseCase: IGetAllPsychologistsForAdminUseCase;
    private _toggleUserStatusUseCase: IToggleUserStatusUseCase;

    constructor(
        getAllUserUseCase: IGetAllUserUseCase,
        getAllPsychologistsUseCase: IGetAllPsychologistsForAdminUseCase,
        toggleUserStatusUseCase: IToggleUserStatusUseCase,
    ) {
        this._getAllUserUseCase = getAllUserUseCase;
        this._getAllPsychologistsUseCase = getAllPsychologistsUseCase;
        this._toggleUserStatusUseCase = toggleUserStatusUseCase;
    }

    getAllUsers = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllUserUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                gender: req.query.gender as UserGender,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_USERS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getAllPsychologists = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { search, sort, gender } = req.query;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllPsychologistsUseCase.execute({
                search: search as string,
                sort: sort as SortFilter,
                gender: gender as UserGender,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_PSYCHOLOGISTS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    toggleUserStatus = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.userId;
            const { status } = req.body;

            if (!['active', 'inactive'].includes(status)) {
                throw new AppError(generalMessages.ERROR.INVALID_STATUS, HttpStatus.BAD_REQUEST);
            }

            await this._toggleUserStatusUseCase.execute(userId, status);

            res.status(HttpStatus.OK).json({
                success: true,
                message: userMessages.SUCCESS.USER_STATUS_UPDATED,
            });
            return;
        } catch (error) {
            next(error);
        }
    };
}
