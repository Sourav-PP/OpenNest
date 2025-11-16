import type { PaymentMethodType, PaymentPurposeType, PaymentStatusType } from '@/constants/types/Payment';
import type { UserGenderType, UserRoleType } from '@/constants/types/User';

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

export interface ITopUserDto {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        isActive: boolean;
        profileImage?: string;
    };
    totalConsultations: number;
    averageRating?: number;
}

export interface ITransactionDto {
    id: string;
    amount: number;
    currency: string;
    paymentStatus: PaymentStatusType;
    paymentMethod: PaymentMethodType
    purpose: PaymentPurposeType;
    transactionId?: string;
    createdAt: Date;   
}
