// Input and Output types for Profile Use Cases
import { Kyc } from "../../domain/entities/Kyc";
import { Psychologist } from "../../domain/entities/Psychologist";

export interface IVerifyProfileInput {
    userId: string;
    aboutMe: string;
    qualification: string;
    specializations: string[];
    defaultFee: number;
    isVerified: boolean;
    specializationFees: {
        specializationId: string;
        specializationName: string;
        fee: number;
    }[];
    identificationDoc: string;
    educationalCertification: string;
    experienceCertificate: string;
}

export interface IVerifyProfileOutput {
    psychologist: Psychologist,
    kyc: Kyc
}