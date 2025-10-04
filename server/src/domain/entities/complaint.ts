export interface Complaint {
  id: string;
  consultationId: string;
  userId: string;
  description: string;
  status: 'pending' | 'verified' | 'rejected'
  createdAt?: Date;
  updatedAt?: Date;
}