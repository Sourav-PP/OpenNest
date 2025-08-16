export interface IUserDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'psychologist';
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: string;
    isActive?: boolean;
}


export interface IUserUpdatedDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: string;
}

export interface ILoginOutputDto {
    user: {
        name: string;
        email: string;
        role: 'user' | 'psychologist';
        profileImage?: string;
    };
    accessToken: string;
    refreshToken: string;
    hasSubmittedVerificationForm: boolean;
} 

