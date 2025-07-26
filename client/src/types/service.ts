export interface IGetAllServiceRequest {
    limit?: number;
    page?: number
}

export interface IServiceDTO {
    id: string;
    name: string;
    description: string;
    bannerImage: string;
}

export interface IGetAllServiceResponse {
    services: IServiceDTO[];
    totalCount?: number
}