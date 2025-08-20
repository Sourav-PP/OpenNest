import type { BackendResponse } from '../api/api';

export interface IGetAllServiceRequest {
    limit?: number;
    page?: number;
    search?: string;
}

export interface IServiceDTO {
    id: string;
    name: string;
    description: string;
    bannerImage: string;
}

export interface IGetAllServiceResponseData {
    services: IServiceDTO[];
    totalCount?: number
}

export type IGetAllServiceResponse = BackendResponse<IGetAllServiceResponseData>