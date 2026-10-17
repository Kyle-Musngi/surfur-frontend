import apiClient from './client';
import type { PaginatedResponse, AdoptionInquiry } from '../types';

export const adoptionsApi = {
  submit: async (data: FormData | Record<string, unknown>) => {
    const isFormData = data instanceof FormData;
    const res = await apiClient.post('/adoptions/', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
    });
    return res.data;
  },

  getMyInquiries: async (): Promise<PaginatedResponse<AdoptionInquiry> | AdoptionInquiry[]> => {
    const res = await apiClient.get('/adoptions/mine/');
    return res.data;
  },

  getDetail: async (id: string): Promise<AdoptionInquiry> => {
    const res = await apiClient.get(`/adoptions/${id}/`);
    return res.data;
  },

  getShelterInquiries: async (shelterSlug: string): Promise<PaginatedResponse<AdoptionInquiry> | AdoptionInquiry[]> => {
    const res = await apiClient.get(`/adoptions/shelter/${shelterSlug}/`);
    return res.data;
  },

  updateStatus: async (
    id: string,
    statusOrPayload: string | { status: string; notes?: string; pet_status?: string },
    notes?: string,
    pet_status?: string
  ) => {
    const payload = typeof statusOrPayload === 'string'
      ? { status: statusOrPayload, notes, pet_status }
      : statusOrPayload;
    const res = await apiClient.patch(`/adoptions/${id}/status/`, payload);
    return res.data;
  },
};
