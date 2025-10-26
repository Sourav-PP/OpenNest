import { IPlanRepository } from '@/domain/repositoryInterface/IPlanRepository';
import { GenericRepository } from '../GenericRepository';
import { Plan } from '@/domain/entities/plan';
import {
    IPlanDocument,
    PlanModel,
} from '@/infrastructure/database/models/user/PlanModel';

export class PlanRepository
    extends GenericRepository<Plan, IPlanDocument>
    implements IPlanRepository
{
    constructor() {
        super(PlanModel);
    }

    async findByStripePriceId(priceId: string): Promise<Plan | null> {
        const plan = await PlanModel.findOne({ stripePriceId: priceId }).exec();
        if (!plan) return null;
        return this.map(plan);
    }

    async list(): Promise<Plan[]> {
        const plans = await PlanModel.find().exec();
        return plans.map(p => this.map(p));
    }

    async findByName(name: string): Promise<Plan | null> {
        const plan = await PlanModel.findOne({ name: { $regex: `^${name}$`, $options: 'i' } }).exec();
        if (!plan) return null;
        return this.map(plan);
    }
}
