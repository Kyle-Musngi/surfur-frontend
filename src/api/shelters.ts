import apiClient from './client';
import type { PaginatedResponse, Shelter, ShelterFilters } from '../types';

export const sheltersApi = {
  list: async (filters: ShelterFilters = {}): Promise<PaginatedResponse<Shelter>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params.set(key, String(val));
    });
    const res = await apiClient.get(`/shelters/?${params}`);
    return res.data;
  },

  detail: async (slug: string): Promise<Shelter> => {
    const res = await apiClient.get(`/shelters/${slug}/`);
    return res.data;
  },

  register: async (data: Partial<Shelter> | Record<string, unknown>) => {
    const res = await apiClient.post('/shelters/register/', data);
    return res.data;
  },

  update: async (slug: string, data: Partial<Shelter>) => {
    const res = await apiClient.patch(`/shelters/${slug}/update/`, data);
    return res.data;
  },
};
