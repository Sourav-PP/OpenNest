export interface User {
    id?: string
    name: string,
    email: string,
    phone: string,
    role: 'user' | 'psychologist',
    password: string,
    profileImage?: string
    dateOfBirth?: Date,
    gender?: string,
    isActive?: boolean,
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'psychologist';
}