import apiClient from './client';
import type { PaginatedResponse, Event } from '../types';

export const eventsApi = {
  list: async (params?: Record<string, string>): Promise<PaginatedResponse<Event>> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiClient.get(`/events/${query}`);
    return res.data;
  },

  detail: async (id: string): Promise<Event> => {
    const res = await apiClient.get(`/events/${id}/`);
    return res.data;
  },
};
