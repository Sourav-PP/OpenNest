export interface IAdminService {
    getTotals(): Promise<{ users: number; psychologists: number; consultations: number; revenue: number }>;
}
