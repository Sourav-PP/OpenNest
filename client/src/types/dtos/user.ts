import type { UserGenderType, UserRoleType } from '@/constants/User';

export interface IUserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRoleType;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: UserGenderType;
  isActive?: boolean;
}
