import { ClientSession } from 'mongoose';
import { Consultation, ConsultationNotes } from '../entities/consultation';
import { Message } from '../entities/message';
import { Payment } from '../entities/payment';
import { Psychologist } from '../entities/psychologist';
import { Slot } from '../entities/slot';
import { User } from '../entities/user';
import { ConsultationStatusFilter } from '../enums/ConsultationEnums';
import { RevenueFilter, SortFilter } from '../enums/SortFilterEnum';
import { PaginatedPsychologistReviewsDTO } from '@/useCases/dtos/psychologist';
import { IRevenueStatDto, ITopConsultationDto } from '@/useCases/dtos/consultation';
import { ITopUserDto } from '@/useCases/dtos/user';

export interface IConsultationRepository {
    create(data: Omit<Consultation, 'id'>): Promise<Consultation>;
    isSlotBooked(slotId: string): Promise<boolean>;
    findPatientHistory(
        psychologistId: string,
        patientId: string,
        params: {
            search?: string;
            sort?: SortFilter;
            skip?: number;
            limit?: number;
        },
    ): Promise<{ consultation: Consultation; patient: User }[]>;
    findByPsychologistId(
        psychologistId: string,
        params?: {
            search?: string;
            sort?: SortFilter;
            skip?: number;
            limit?: number;
            status: ConsultationStatusFilter;
        },
    ): Promise<
        {
            consultation: Consultation;
            patient: User;
            payment?: Payment;
            lastMessage?: Message;
            lastMessageTime?: Date;
            unreadCount: number;
        }[]
    >;
    findByPatientId(
        patientId: string,
        params: {
            search?: string;
            sort?: SortFilter;
            skip?: number;
            limit?: number;
            status?: ConsultationStatusFilter;
        },
    ): Promise<
        {
            consultation: Consultation;
            psychologist: Psychologist;
            user: User;
            lastMessage?: Message;
            lastMessageTime?: Date;
            unreadCount: number;
        }[]
    >;
    findById(id: string): Promise<Consultation | null>;
    findByIds(ids: string[]): Promise<Consultation[]>;
    findByIdWithDetails(
        id: string,
    ): Promise<{
        consultation: Consultation;
        psychologist: Psychologist & User;
        user: User;
        slot: Slot;
        payment: Payment | null;
    } | null>;
    countAllByPatientId(patientId: string): Promise<number>;
    countAllByPsychologistId(psychologistId: string): Promise<number>;
    countPatientHistory(psychologistId: string, patientId: string): Promise<number>;
    update(consultation: Consultation): Promise<Consultation | null>;
    updateConsultation(id: string, update: Partial<Consultation>): Promise<Consultation | null>;
    findAllWithDetails(params: {
        search?: string;
        sort?: SortFilter;
        skip?: number;
        limit?: number;
        status?: ConsultationStatusFilter;
    }): Promise<{ consultation: Consultation; psychologist: Psychologist & User; patient: User; payment?: Payment }[]>;
    countAll(params: { search?: string; status?: ConsultationStatusFilter }): Promise<number>;
    findByPatientAndPsychologistId(patientId: string, psychologistId: string): Promise<Consultation[]>;
    findUnpaidCompletedConsultationsByPsychologistId(psychologistId: string): Promise<Consultation[]>;
    markIncludedInPayout(consultationIds: string[], session?: ClientSession): Promise<void>;
    findMissedConsultation(currentDate: Date): Promise<Consultation[]>;
    markAsMissed(
        consultationId: string,
        update: {
            status: string;
            includedInPayout: boolean;
            cancelledAt: Date;
            cancellationReason: string;
        },
    ): Promise<void>;
    updateNotes(consultationId: string, notes: ConsultationNotes): Promise<Consultation | null>;
    findMany(filter: Partial<Consultation>): Promise<Consultation[]>;
    findPsychologistReviews(
        psychologistId: string,
        page: number,
        limit: number,
    ): Promise<PaginatedPsychologistReviewsDTO>;
    getRevenueStats(filter: RevenueFilter): Promise<IRevenueStatDto[]>;
    getPsychologistRevenueStats(psychologistId: string, filter: RevenueFilter): Promise<IRevenueStatDto[]>;
    getTopUsersForPsychologist(psychologistId: string, limit: number): Promise<ITopUserDto[]>;
    findMostRatedConsultations(psychologistId: string, limit: number): Promise<ITopConsultationDto[]>;
    countCompletedByPsychologistId(psychologistId: string): Promise<number>;
    countUniquePatientsByPsychologistId(psychologistId: string): Promise<number> 
}
