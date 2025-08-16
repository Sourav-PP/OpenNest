export interface IGetAllServiceInput {
  limit?: number;
  page?: number;
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