import { AdminModel } from '../infrastructure/database/models/admin/adminModel';
import bcrypt from 'bcrypt';

export const createAdmin = async() => {
    const existing = await AdminModel.findOne({ email: 'admin@example.com' });
    if (existing) return; 

    const hashPasword = await bcrypt.hash('Admin@123', 10);

    await AdminModel.create({
        email: 'admin@example.com',
        password: hashPasword,
    });

    console.log('admin user created');
};