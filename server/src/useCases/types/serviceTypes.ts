export interface IGetAllServiceInput {
  limit?: number;
  page?: number;
  search?: string;
}

export interface IServiceDTO {
  id: string;
  name: string;
  description: string;
  bannerImage: string
}

export interface IGetAllServiceOutput {
  services: IServiceDTO[],
  totalCount?: number
}