import mongoose from "mongoose";
import { IConsultationDto } from "../../../domain/dtos/consultation";
import { Consultation } from "../../../domain/entities/consultation";
import { IConsultationRepository } from "../../../domain/interfaces/IConsultationRepository";
import { IGetConsultationsRequest } from "../../../useCases/types/userTypes";
import { ConsultationModel } from "../../database/models/user/Consultation";

export class ConsultationRepository implements IConsultationRepository {
    async createConsultation(data: Consultation): Promise<Consultation> {
        const createdConsultation = await ConsultationModel.create(data)
        const consultationObj = createdConsultation.toObject();

        return {
            ...consultationObj,
            patientId: consultationObj.patientId.toString(),
            psychologistId: consultationObj.psychologistId.toString(),
            subscriptionId: consultationObj.subscriptionId?.toString(),
            slotId: consultationObj.slotId.toString(),
            issue: consultationObj.issue?.map(i => i.toString()),
            id: consultationObj._id.toString(),
        }
    }

    async isSlotBooked(slotId: string): Promise<boolean> {
        const existing = await ConsultationModel.findOne({slotId, status: 'booked'})

        return existing ? true : false
    }

    async findByPatientId(patientId: string, params:{
        search?: string,
        sort?:'asc' | 'desc',
        skip?: number,
        limit?: number,
        status: 'booked' | 'cancelled' | 'completed' | 'rescheduled'
    }): Promise<IConsultationDto[]> {
        const matchStage: Record<string , unknown> = {patientId: new mongoose.Types.ObjectId(patientId)}

        if(params.status) {
            matchStage.status = params.status
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1

        const pipeline: any[] = [
            { $match: matchStage },

            {
                $lookup: {
                from: 'psychologists',
                localField: 'psychologistId',
                foreignField: '_id',
                as: 'psychologist'
                }
            },
            { $unwind: '$psychologist' },

            {
                $lookup: {
                from: 'users',
                localField: 'psychologist.userId',
                foreignField: '_id',
                as: 'psychologist.user'
                }
            },
            { $unwind: '$psychologist.user' }
        ];

        if(params.search) {
            pipeline.push({
                $match: {
                    'psychologist.user.name': { $regex: params.search, $options: 'i' }
                }
            })
        }

        pipeline.push({$sort: {startDateTime: sortOrder}})

        if (typeof params.skip === 'number' && params.skip > 0) {
            pipeline.push({ $skip: params.skip });
        }

        if (typeof params.limit === 'number' && params.limit > 0) {
            pipeline.push({ $limit: params.limit });
        }

        pipeline.push({
            $project: {
                id: '$_id',
                patientId: 1,
                startDateTime: 1,
                endDateTime: 1,
                sessionGoal: 1,
                status: 1,
                meetingLink: 1,
                psychologist: {
                    id: '$psychologist._id',
                    name: '$psychologist.user.name',
                }
            }
        })

        const consultations = await ConsultationModel.aggregate(pipeline)
        console.log('consultations in the consultationrepository:', consultations)
        return consultations
    }

    async countAllByPatientId(patientId: string): Promise<number> {
        return await ConsultationModel.countDocuments({patientId})
    }
}