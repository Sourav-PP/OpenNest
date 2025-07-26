export interface PsychologistAggregateModel {
  _id: string;
  userId: string;
  isVerified: boolean;
  aboutMe: string;
  qualification: string;
  defaultFee: number;
  specializationFees: {
    specializationId: string;
    specializationName: string;
    fee: number;
  }[]; 
  user: {
    name: string;
    email: string;
    profileImage: string;
  };
  specializations: string[];
}