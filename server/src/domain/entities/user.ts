import { UserGender, UserRole } from '../enums/UserEnums';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    password?: string;
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: UserGender;
    isActive: boolean;
    googleId?: string;
}
