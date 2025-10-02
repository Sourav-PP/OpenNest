import { User } from '../../../domain/entities/user';
import { IUserRepository } from '../../../domain/repositoryInterface/IUserRepository';
import { userModel, IUserDocument } from '../../database/models/user/UserModel';
import { FilterQuery } from 'mongoose';
import { PendingSignupModel } from '../../database/models/user/PendinSignupModel';
import { PendingUser } from '@/domain/entities/pendingUser';
import { GenericRepository } from '../GenericRepository';

export class UserRepository
    extends GenericRepository<User, IUserDocument>
    implements IUserRepository
{
    constructor() {
        super(userModel);
    }

    async findAll(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        gender?: 'Male' | 'Female' | 'all';
        skip: number;
        limit: number;
    }): Promise<User[]> {
        const filter: FilterQuery<User> = { role: 'user' };

        if (params.search) {
            filter.name = { $regex: params.search, $options: 'i' };
        }

        if (params.gender && params.gender !== 'all') {
            filter.gender = params.gender;
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1;

        const users = await userModel
            .find(filter)
            .sort({ createdAt: sortOrder })
            .skip(params.skip)
            .limit(params.limit);

        console.log('all users: ', users);

        return users.map(user => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            isActive: user.isActive,
            profileImage: user.profileImage,
        }));
    }

    async countAll(params: {
        search?: string;
        gender?: 'Male' | 'Female' | 'all';
    }): Promise<number> {
        const filter: FilterQuery<User> = { role: 'user' };

        if (params.search) {
            filter.name = { $regex: params.search, $options: 'i' };
        }

        if (params.gender && params.gender !== 'all') {
            filter.gender = params.gender;
        }

        return userModel.countDocuments(filter);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ email }, '+password');
    }

    async findById(userId: string): Promise<User | null> {
        const userDoc = await userModel.findById(userId).select('+password');
        if (!userDoc) return null;

        return this.map(userDoc);
    }

    async createPendingSignup(user: PendingUser): Promise<void> {
        await PendingSignupModel.updateOne(
            { email: user.email },
            {
                $set: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    password: user.password,
                    role: user.role,
                    profileImage: user.profileImage,
                },
            },
            { upsert: true },
        );
    }

    async findPendingSignup(
        email: string,
    ): Promise<Omit<User, 'isActive'> | null> {
        const userDoc = await PendingSignupModel.findOne({ email }).select(
            '+password',
        );
        if (!userDoc) return null;

        const userObj = userDoc.toObject();

        return {
            ...userObj,
            id: userObj._id.toString(),
        };
    }

    async deletePendingSignup(email: string): Promise<void> {
        await PendingSignupModel.deleteOne({ email });
    }

    async isUserBlocked(userId: string): Promise<boolean> {
        const user = await userModel.findById(userId);

        if (!user || user.isActive === false) {
            return true;
        }
        return false;
    }

    async updateProfile(
        id: string,
        updates: Partial<User>,
    ): Promise<User | null> {
        console.log('user id in user: ', id);
        const updated = await userModel.findByIdAndUpdate(id, updates, {
            new: true,
        });
        if (!updated) return null;

        const obj = updated.toObject();
        return {
            ...obj,
            id: obj._id.toString(),
        } as User;
    }

    async updateStatus(id: string, isActive: boolean): Promise<void> {
        await userModel.findByIdAndUpdate(id, { isActive }, { new: true });
    }

    async updatePassword(email: string, newPassword: string): Promise<void> {
        await userModel.findOneAndUpdate(
            { email },
            { password: newPassword },
            { new: true },
        );
    }
}
