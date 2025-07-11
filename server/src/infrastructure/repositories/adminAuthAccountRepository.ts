import { AdminModel } from "../database/models/adminModel";
import { AuthAccountRepository } from "../../domain/interfaces/authAccountRepository";

export class AdminAuthAccountRepository implements AuthAccountRepository {
    async findById(id: string): Promise<{ _id: string; role: string; email: string; } | null> {
        const admin = await AdminModel.findById(id)
        if (!admin) return null;

    return {
      _id: admin._id?.toString() ?? "",
      role: "admin",
      email: admin.email,
    };   
    }
}