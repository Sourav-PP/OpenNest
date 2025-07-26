export interface IUserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'psychologist';
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: string;
  isActive?: boolean;
}