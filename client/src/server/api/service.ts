import { server } from '../server';
import type { IGetAllServiceResponse, IGetAllServiceRequest } from '../../types/service';

export const serviceApi = {
  getAll: (params?: IGetAllServiceRequest) => server.get<IGetAllServiceResponse>('/user/services', {params})
};