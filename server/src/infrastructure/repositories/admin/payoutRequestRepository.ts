import { PayoutRequest } from '@/domain/entities/payoutRequest';
import { GenericRepository } from '../GenericRepository';
import {
    IPayoutRequestDocument,
    PayoutRequestModel,
} from '@/infrastructure/database/models/admin/payoutRequestModel';
import { IPayoutRequestRepository } from '@/domain/repositoryInterface/IPayoutRequestRepository';
import { ClientSession } from 'mongoose';
import { User } from '@/domain/entities/user';

export class PayoutRequestRepository
    extends GenericRepository<PayoutRequest, IPayoutRequestDocument>
    implements IPayoutRequestRepository
{
    constructor() {
        super(PayoutRequestModel);
    }

    protected map(doc: IPayoutRequestDocument): PayoutRequest {
        const mapped = super.map(doc);

        return {
            id: mapped.id,
            psychologistId: mapped.psychologistId as string,
            consultationIds: mapped.consultationIds.map(id => id as string),
            requestedAmount: mapped.requestedAmount,
            commissionAmount: mapped.commissionAmount,
            payoutAmount: mapped.payoutAmount,
            status: mapped.status,
            createdAt: mapped.createdAt,
            updatedAt: mapped.updatedAt,
            approvedAt: mapped.approvedAt,
            rejectedAt: mapped.rejectedAt,
        };
    }

    async findAllWithPsychologist(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        skip: number;
        limit: number;
    }): Promise<{ payoutRequest: PayoutRequest; psychologist: User }[]> {
        const sortOrder = params.sort === 'asc' ? 1 : -1;

        const pipeline: any[] = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'psychologistId',
                    foreignField: '_id',
                    as: 'psychologist',
                },
            },
            { $unwind: '$psychologist' },
        ];

        if (params.search) {
            pipeline.push({
                $match: {
                    'psychologist.name': {
                        $regex: params.search,
                        $options: 'i',
                    },
                },
            });
        }

        pipeline.push({ $sort: { createdAt: sortOrder } });
        pipeline.push({ $skip: params.skip });
        pipeline.push({ $limit: params.limit });

        const payoutRequests = await PayoutRequestModel.aggregate(pipeline);

        return payoutRequests.map(pr => ({
            payoutRequest: {
                id: pr._id.toString(),
                psychologistId: pr.psychologistId.toString(),
                consultationIds: pr.consultationIds,
                requestedAmount: pr.requestedAmount,
                commissionAmount: pr.commissionAmount,
                payoutAmount: pr.payoutAmount,
                status: pr.status,
                createdAt: pr.createdAt,
                updatedAt: pr.updatedAt,
                approvedAt: pr.approvedAt,
                rejectedAt: pr.rejectedAt,
            } as PayoutRequest,
            psychologist: {
                id: pr.psychologist._id.toString(),
                name: pr.psychologist.name,
                profileImage: pr.psychologist.profileImage,
            } as User,
        }));
    }

    async getTotalCountByPsychologistId(psychologistId: string): Promise<number> {
        const filter = {
            psychologistId,
        };

        const totalCount = await PayoutRequestModel.countDocuments(filter);
        return totalCount;
    }

    async countAll(params: { search?: string }): Promise<number> {
        const pipeline: any[] = [
            {
                $lookup: {
                    from: 'users', // join with user collection
                    localField: 'psychologistId',
                    foreignField: '_id',
                    as: 'psychologist',
                },
            },
            { $unwind: '$psychologist' },
        ];

        // Apply search if provided
        if (params.search) {
            pipeline.push({
                $match: {
                    'psychologist.name': {
                        $regex: params.search,
                        $options: 'i',
                    },
                },
            });
        }

        // Count documents
        pipeline.push({ $count: 'totalCount' });

        const result = await PayoutRequestModel.aggregate(pipeline);

        return result.length > 0 ? result[0].totalCount : 0;
    }

    async findByPsychologistId(
        psychologistId: string,
        params?: {
            sort?: 'asc' | 'desc';
            skip?: number;
            limit?: number;
        },
    ): Promise<PayoutRequest[]> {
        const filter = { psychologistId };
        let query = PayoutRequestModel.find(filter);

        if (params?.sort) {
            query = query.sort({ createdAt: params.sort === 'asc' ? 1 : -1 });
        }
        if (params?.skip !== undefined) query = query.skip(params.skip);
        if (params?.limit !== undefined) query = query.limit(params.limit);

        const docs = await query.exec();
        return docs.map(doc => this.map(doc));
    }

    async updateStatus(
        id: string,
        status: 'approved' | 'rejected',
        date: Date,
        session?: ClientSession,
    ): Promise<PayoutRequest | null> {
        const doc = await PayoutRequestModel.findByIdAndUpdate(
            id,
            {
                status,
                updatedAt: date,
                ...(status === 'approved'
                    ? { approvedAt: date }
                    : { rejectedAt: date }),
            },
            { new: true, session },
        ).exec();

        if (!doc) return null;

        return this.map(doc);
    }
}
