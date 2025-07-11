import { IUser } from "../../domain/entities/user";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { AuthAccountRepository } from "../../domain/interfaces/authAccountRepository";
import { userModel } from "../database/models/UserModel";

export class MongoUserRepository implements UserRepository   {
    async findByEmail(email: string): Promise<IUser | null> {
        const userDoc = await userModel.findOne({ email }).select("+password")
        if(!userDoc) return null

        const userObj = userDoc.toObject()

        return {
            ...userObj,
            _id: userObj._id.toString()
        } as IUser
    }

    async findById(userId: string): Promise<IUser | null> {
        const userDoc = await userModel.findById(userId)
        if(!userDoc) return null

        const userObj = userDoc.toObject()

        return {
            ...userObj,
            _id: userObj._id.toString()
        } as IUser
    }

    async create(user: IUser): Promise<IUser> {
        const createdUser = await userModel.create(user)
        const userObj = createdUser.toObject()

        return {
            ...userObj,
            _id: userObj._id.toString()
        } as IUser
    }
}