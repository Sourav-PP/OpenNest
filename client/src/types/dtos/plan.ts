export interface IPlanDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  creditsPerPeriod: number;
  billingPeriod: 'month' | 'year' | 'week'
  stripePriceId: string;
  createdAt?: Date;
  updatedAt?: Date;
}