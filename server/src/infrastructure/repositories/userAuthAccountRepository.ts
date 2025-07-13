import { userModel } from "../database/models/user/UserModel";
import { AuthAccountRepository } from "../../domain/interfaces/authAccountRepository";

export class UserAuthAccountRepository implements AuthAccountRepository {
    async findById(id: string): Promise<{ _id: string; role: string; email: string; } | null> {
        const user = await userModel.findById(id);
        if (!user) return null;

        return {
            _id: user._id?.toString(),
            role: user.role,
            email: user.email,
        };
    }
}