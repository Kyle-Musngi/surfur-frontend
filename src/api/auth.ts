import apiClient from './client';
import type { User } from '../types';

export const authApi = {
  register: async (data: { email: string; full_name: string; password: string; password_confirm: string }) => {
    const res = await apiClient.post('/auth/register/', data);
    return res.data as { user: User; access: string; refresh: string };
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login/', { email, password });
    return res.data as { access: string; refresh: string };
  },

  logout: async (refresh: string) => {
    await apiClient.post('/auth/logout/', { refresh });
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get('/auth/profile/');
    return res.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await apiClient.patch('/auth/profile/', data);
    return res.data;
  },
};
