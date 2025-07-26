import { Admin } from "../../../domain/entities/Admin";
import { IAdminRepository } from "../../../domain/interfaces/IAdminRepository";
import { AdminModel } from "../../database/models/admin/adminModel";

export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<Admin | null> {
        const adminDoc = await AdminModel.findOne({email}).select("+password")
        if(!adminDoc) return null

        const obj = adminDoc.toObject()
         
        return {
            ...obj,
            id: obj._id.toString()
        }
    }
}