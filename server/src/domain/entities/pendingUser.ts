import { UserRole } from '../enums/UserEnums';

export interface PendingUser {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role: UserRole;
    profileImage?: string;
}
