import { Admin } from '../../../domain/entities/admin';
import { IAdminRepository } from '@/domain/repositoryInterface/IAdminRepository';
import { AdminModel } from '../../database/models/admin/adminModel';
import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IBookingTrend, IUserTrendDto } from '@/useCases/dtos/user';
import { userModel } from '@/infrastructure/database/models/user/UserModel';
import { ConsultationModel } from '@/infrastructure/database/models/user/Consultation';
import { ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { PsychologistModel } from '@/infrastructure/database/models/psychologist/PsychologistModel';
import { UserRole } from '@/domain/enums/UserEnums';

export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<Admin | null> {
        const adminDoc = await AdminModel.findOne({ email }).select('+password');
        if (!adminDoc) return null;

        const obj = adminDoc.toObject();

        return {
            ...obj,
            id: obj._id.toString(),
        };
    }

    async getUserTrend(filter: RevenueFilter): Promise<IUserTrendDto[]> {
        const groupByFormat =
            filter === RevenueFilter.DAILY
                ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                : filter === RevenueFilter.WEEKLY
                    ? { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

        const users = await userModel.aggregate<IUserTrendDto>([
            {
                $match: { isActive: true, role: UserRole.USER }, 
            },
            {
                $group: {
                    _id: groupByFormat,
                    userCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    userCount: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);

        // Verified psychologists
        const psychologists = await PsychologistModel.aggregate<IUserTrendDto>([
            { $match: { isVerified: true } },
            {
                $group: {
                    _id: groupByFormat,
                    psychologistCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    psychologistCount: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);

        // Merge both trends by date
        const trendMap = new Map<string, IUserTrendDto>();

        for (const u of users) {
            trendMap.set(u.date, { date: u.date, userCount: u.userCount, psychologistCount: 0 });
        }

        for (const p of psychologists) {
            if (trendMap.has(p.date)) {
                trendMap.get(p.date)!.psychologistCount = p.psychologistCount;
            } else {
                trendMap.set(p.date, { date: p.date, userCount: 0, psychologistCount: p.psychologistCount });
            }
        }

        // Return merged data sorted by date
        return Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }

    async getBookingTrend(filter: RevenueFilter): Promise<IBookingTrend[]> {
        const groupByFormat =
            filter === RevenueFilter.DAILY
                ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                : filter === RevenueFilter.WEEKLY
                    ? { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

        const completedOrBooked = await ConsultationModel.aggregate<IBookingTrend>([
            {
                $match: { status: { $in: [ConsultationStatus.COMPLETED, ConsultationStatus.BOOKED] } },
            },
            {
                $group: {
                    _id: groupByFormat,
                    completedOrBooked: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    completedOrBooked: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);
        
        const cancelled = await ConsultationModel.aggregate<IBookingTrend>([
            {
                $match: {
                    status: ConsultationStatus.CANCELLED,
                },
            },
            {
                $group: {
                    _id: groupByFormat,
                    cancelled: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    cancelled: 1,
                },
            },
        ]);

        // Merge both by date
        const trendMap = new Map<string, IBookingTrend>();

        for (const c of completedOrBooked) {
            trendMap.set(c.date, { date: c.date, completedOrBooked: c.completedOrBooked, cancelled: 0 });
        }

        for (const c of cancelled) {
            if (trendMap.has(c.date)) {
                trendMap.get(c.date)!.cancelled = c.cancelled;
            } else {
                trendMap.set(c.date, { date: c.date, completedOrBooked: 0, cancelled: c.cancelled });
            }
        }

        return Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }
}
