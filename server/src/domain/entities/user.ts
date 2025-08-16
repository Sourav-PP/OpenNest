export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'psychologist';
    password?: string;
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: string;
    isActive: boolean;
    googleId?: string;
}

