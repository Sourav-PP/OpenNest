export interface SpecializationFee {
    specializationId: string,
    specializationName: string,
    fee: number
}

export interface Psychologist {
    id: string,
    userId: string,
    aboutMe: string,
    qualification: string,
    specializations: string[],
    defaultFee: number,
    isVerified: boolean,
    specializationFees: SpecializationFee[]
    averageRating?: number;
    totalReviews?: number;
}   
