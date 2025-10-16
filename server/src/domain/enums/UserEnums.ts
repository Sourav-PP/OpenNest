export enum UserRole {
    USER = 'user',
    PSYCHOLOGIST = 'psychologist',
    ADMIN = 'admin',
}

export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export type UserGenderFilter = UserGender | 'all';