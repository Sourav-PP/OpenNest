import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { Psychologist } from '@/domain/entities/psychologist';
import { IVerifyProfileInput, IVerifyProfileOutput } from '@/useCases/types/psychologistTypes';
import { IVerifyPsychologistUseCase } from '@/useCases/interfaces/psychologist/profile/IVerifyPsychologistUseCase';
import { AppError } from '@/domain/errors/AppError';
import { fileMessages } from '@/shared/constants/messages/fileMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IFileStorage } from '@/useCases/interfaces/IFileStorage';


export class VerifyPsychologistUseCase implements IVerifyPsychologistUseCase {
    private _psychologistRepository: IPsychologistRepository;
    private _kycRepository: IKycRepository;
    private _fileStorage: IFileStorage;

    constructor(
        psychologistRepository: IPsychologistRepository,    
        kycRepository: IKycRepository,
        fileStorage: IFileStorage,
    ) {
        this._psychologistRepository = psychologistRepository;
        this._kycRepository = kycRepository;
        this._fileStorage = fileStorage;
    }

    async execute(req: IVerifyProfileInput): Promise<IVerifyProfileOutput> {
        const { userId, files, ...profileData } = req;
        
        if (!files) {
            throw new AppError(fileMessages.ERROR.ALL_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const uploadDoc = async(field: string, label: string): Promise<string> => {
            const file = files[field]?.[0];
            if (!file) {
                throw new AppError(fileMessages.ERROR.DOCUMENT_NOT_UPLOADED(label), HttpStatus.BAD_REQUEST);
            }
            return await this._fileStorage.upload(file.buffer, `${label}-${Date.now()}`, 'kyc-docs');
        };

        const identificationDoc = await uploadDoc('identificationDoc', 'identification');
        const educationalCertification = await uploadDoc('educationalCertification', 'education');  
        const experienceCertificate = await uploadDoc('experienceCertificate', 'experience');

        const existingPsychologist = await this._psychologistRepository.findById(userId);
        let psychologist: Psychologist | null;

        if (existingPsychologist) {
            psychologist = await this._psychologistRepository.updateByUserId(userId, {
                ...profileData,
                isVerified: false,
            });

            await this._kycRepository.updateByPsychologistId(existingPsychologist.id,{
                identificationDoc,
                educationalCertification,
                experienceCertificate,
                kycStatus: 'pending',
            });
        } else {
            psychologist = await this._psychologistRepository.create({ userId, ...profileData, isVerified: false });
    
            await this._kycRepository.create({
                psychologistId: psychologist.id,
                identificationDoc,
                educationalCertification,
                experienceCertificate,
                kycStatus: 'pending',
            });
        }

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const kyc = await this._kycRepository.findByPsychologistId(psychologist.id);

        if (!kyc) {
            throw new AppError(psychologistMessages.ERROR.KYC_CREATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            psychologist,
            kyc,
        };
    }
}