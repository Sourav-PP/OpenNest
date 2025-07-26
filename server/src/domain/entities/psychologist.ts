export interface SpeicalizationFee {
    specializationId: string,
    specializationName: string,
    fee: number
}

export interface Psychologist {
    id?: string,
    userId: string,
    aboutMe: string,
    qualification: string,
    specializations: string[],
    defaultFee: number,
    isVerified: boolean,
    specializationFees: SpeicalizationFee[]
}   
