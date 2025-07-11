import { IAdmin } from "../../domain/entities/admin";
import { AdminRepository } from "../../domain/interfaces/adminRepository";
import { AdminModel } from "../database/models/adminModel";

export class MongoAdminRepository implements AdminRepository {
    async findByEmail(email: string): Promise<IAdmin | null> {
        const adminDoc = await AdminModel.findOne({email}).select("+password")
        if(!adminDoc) return null

        const obj = adminDoc.toObject()
         
        return {
            ...obj,
            _id: obj._id.toString()
        } as IAdmin
    }
}