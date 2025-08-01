import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IAuthAccountRepository } from "../../domain/interfaces/IAuthAccountRepository";
import { userModel } from "../database/models/user/UserModel";
import { AppError } from "../../domain/errors/AppError";
import { IUserDto } from "../../domain/dtos/user";
import { FilterQuery } from "mongoose";
import { PendingSignupModel } from "../database/models/user/PendinSignupModel";

export class UserRepository implements IUserRepository   {
    async findAll(params: { search?: string; sort?: "asc" | "desc"; gender?: "Male" | "Female"; skip: number; limit: number; }): Promise<User[]> {
        const filter: FilterQuery<User> = {role: "user"}

        if(params.search) {
            filter.name = { $regex: params.search, $options: 'i' }
        }

        if(params.gender) {
            filter.gender = params.gender
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1
        
        const users = await userModel.find(filter)
        .sort({createdAt: sortOrder})
        .skip(params.skip)
        .limit(params.limit)

        console.log("all users: ", users)

        
        return users.map( user => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            isActive: user.isActive,
            profileImage: user.profileImage,
        }))
    }

    async countAll(params: { search?: string; gender?: "Male" | "Female"; }): Promise<number> {
        const filter: FilterQuery<User> = {role: "user"}

        if(params.search) {
            filter.name = { $regex: params.search, $options: 'i'}
        }

        if(params.gender) {
            filter.gender = params.gender
        }

        return userModel.countDocuments(filter)
    }


    async findByEmail(email: string): Promise<User | null> {
        const userDoc = await userModel.findOne({ email }).select("+password")
        if(!userDoc) return null

        const userObj = userDoc.toObject()

        return {
            ...userObj,
            id: userObj._id.toString()
        } as User
    }

    async findById(userId: string): Promise<User | null> {
        const userDoc = await userModel.findById(userId)
        if(!userDoc) return null

        const userObj = userDoc.toObject()

        return {
            ...userObj,
            id: userObj._id.toString()
        } as User
    }

    async createPendingSignup(user: User): Promise<void> {
        await PendingSignupModel.updateOne(
            {email: user.email},
            {
                $set: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    password: user.password,
                    role: user.role,
                    profileImage: user.profileImage
                }
            },
            {upsert: true}
        )
    }

    async findPendingSignup(email: string): Promise<User | null> {
        const userDoc = await PendingSignupModel.findOne({ email }).select("+password")
        if(!userDoc) return null

        const userObj = userDoc.toObject()

        return {
            ...userObj,
            id: userObj._id.toString()
        } as User
    }

    async deletePendingSignup(email: string): Promise<void> {
        await PendingSignupModel.deleteOne({email})
    }

    async create(user: User): Promise<User> {
        const createdUser = await userModel.create(user)
        const userObj = createdUser.toObject()

        return {
            ...userObj,
            id: userObj._id.toString()
        } as User
    }

    async updateProfile(id: string, updates: Partial<User>): Promise<User | null> {
        const updated = await userModel.findByIdAndUpdate(id, updates, {new: true})
        if(!updated) return null

        const obj = updated.toObject()
        return {
            ...obj,
            id: obj._id.toString()
        } as User
    }

    async updateStatus(id: string, isActive: boolean): Promise<void> {
        await userModel.findByIdAndUpdate(id, { isActive }, { new: true });
    }
}