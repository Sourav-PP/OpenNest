import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IAuthAccountRepository } from "../../domain/interfaces/IAuthAccountRepository";
import { userModel } from "../database/models/user/UserModel";
import { AppError } from "../../domain/errors/AppError";

export class UserRepository implements IUserRepository   {
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
}