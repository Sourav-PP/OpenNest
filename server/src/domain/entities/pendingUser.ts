export interface PendingUser {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role: 'user' | 'psychologist';
    profileImage?: string;
}