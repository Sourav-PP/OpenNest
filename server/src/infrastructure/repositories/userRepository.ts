import { IUser } from "../../domain/entities/user";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { userModel } from "../database/models/UserModel";

export class MongoUserRepository implements UserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        const userDoc = await userModel.findOne({ email })
        if(!userDoc) return null

        const userObj = userDoc.toObject()
        const { password, ...safeUser} = userObj

        return {
            ...safeUser,
            _id: userObj._id.toString()
        } as IUser
    }

    async create(user: IUser): Promise<IUser> {
        const createdUser = await userModel.create(user)

        const userObj = createdUser.toObject()
        const {password, ...safeUser} = userObj

        return {
            ...safeUser,
            _id: userObj._id.toString()
        } as IUser
    }
}