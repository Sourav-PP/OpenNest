import { AdminModel } from '../infrastructure/database/models/admin/adminModel';
import bcrypt from 'bcrypt';

export const createAdmin = async() => {
    const existing = await AdminModel.findOne({ email: 'admin@example.com' });
    if (existing) return; 

    const hashPassword = await bcrypt.hash('Admin@123', 10);

    await AdminModel.create({
        email: 'admin@example.com',
        password: hashPassword,
    });

    console.log('admin user created');
};