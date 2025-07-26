export interface IGetAllServiceInput {
  limit?: number;
  page?: number;
}

export interface ServiceDTO {
  id: string;
  name: string;
  description: string;
  bannerImage: string
}

export interface IGetAllServiceOutput {
  services: ServiceDTO[],
  totalCount?: number
}