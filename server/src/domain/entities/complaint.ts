import { ComplaintStatus } from '../enums/ComplaintEnums';

export interface Complaint {
    id: string;
    consultationId: string;
    userId: string;
    description: string;
    status: ComplaintStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
