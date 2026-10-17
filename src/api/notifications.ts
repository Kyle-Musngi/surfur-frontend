import apiClient from './client';
import type { PaginatedResponse, Notification } from '../types';

export const notificationsApi = {
  list: async (): Promise<PaginatedResponse<Notification>> => {
    const res = await apiClient.get('/notifications/');
    return res.data;
  },

  markAllRead: async () => {
    const res = await apiClient.post('/notifications/mark-all-read/');
    return res.data;
  },

  markRead: async (id: string) => {
    const res = await apiClient.patch(`/notifications/${id}/`, { is_read: true });
    return res.data;
  },
};
