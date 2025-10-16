import { UserRole } from '@/domain/enums/UserEnums';

export interface ISignupInput {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    file: Express.Multer.File;
    role: UserRole;
}

export type ISignupOutput = string;
