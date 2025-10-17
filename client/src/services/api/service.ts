import { server } from '../server';
import type { IGetAllServiceResponse, IGetAllServiceRequest } from '../../types/dtos/service';
import { userRoutes } from '@/constants/apiRoutes/userRoutes';

export const serviceApi = {
  getAll: (params?: IGetAllServiceRequest) => server.get<IGetAllServiceResponse>(userRoutes.services, { params }),
};
