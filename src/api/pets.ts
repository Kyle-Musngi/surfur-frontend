import apiClient from './client';
import type { PaginatedResponse, Pet, PetFilters } from '../types';

export const petsApi = {
  list: async (filters: PetFilters = {}): Promise<PaginatedResponse<Pet>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== null) {
        params.set(key, String(val));
      }
    });
    const res = await apiClient.get(`/pets/?${params}`);
    return res.data;
  },

  detail: async (id: string): Promise<Pet> => {
    const res = await apiClient.get(`/pets/${id}/`);
    return res.data;
  },

  toggleFavorite: async (petId: string): Promise<{ favorited: boolean }> => {
    const res = await apiClient.post(`/pets/favorites/${petId}/`);
    return res.data;
  },

  getFavorites: async () => {
    const res = await apiClient.get('/pets/favorites/');
    return res.data;
  },

  getShelterPets: async (shelterSlug: string) => {
    const res = await apiClient.get(`/pets/shelter/${shelterSlug}/`);
    return res.data;
  },

  create: async (shelterSlug: string, data: Partial<Pet>) => {
    const res = await apiClient.post(`/pets/shelter/${shelterSlug}/create/`, data);
    return res.data;
  },

  update: async (id: string, data: Partial<Pet>) => {
    const res = await apiClient.patch(`/pets/${id}/update/`, data);
    return res.data;
  },
};
