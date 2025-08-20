import { server } from '../server';
import type { IPsychologistProfileDto } from '@/types/dtos/psychologist';
import type { IRecurringSlotInput, ISingleSlotInput, IDeleteSlotResponse, IDeleteSlotInput } from '@/types/api/slot';
import type { ISlotDto } from '@/types/dtos/slot';
import type { IKycDto } from '@/types/dtos/kyc';
import type { BackendResponse } from '@/types/api/api';

export const psychologistApi = {
  getProfile: async() => server.get<IPsychologistProfileDto>('/psychologist/profile'),
  submitVerification: async(data: FormData ) => server.post<BackendResponse, FormData>('/auth/psychologist/verify-profile', data),
  updatePsychologistProfile: async(data: FormData) => server.put<IPsychologistProfileDto, FormData>('/psychologist/profile', data, {
    headers: { 'Content-Type' : 'multipart/form-data' }
  }),
  createSingleSlot: async(data: ISingleSlotInput) => server.post('/psychologist/slot', data),
  createRecurringSlot: async(data: IRecurringSlotInput) => server.post('/psychologist/slot', data),
  getPsychologistSlots: async() => server.get<ISlotDto[]>('/psychologist/slot'),
  deleteSlotByPsychologist: async (input: IDeleteSlotInput) => server.delete<IDeleteSlotResponse>(`/psychologist/slot/${input.slotId}`),
  getKycDetails: async() => server.get<IKycDto>('/psychologist/kyc')
};