import apiClient from './client';
import type { PaginatedResponse, StrayReport } from '../types';

export const reportsApi = {
  submit: async (data: Record<string, unknown> | FormData) => {
    const isFormData = data instanceof FormData;
    const res = await apiClient.post('/reports/', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  getMyReports: async (): Promise<PaginatedResponse<StrayReport> | StrayReport[]> => {
    const res = await apiClient.get('/reports/mine/');
    return res.data;
  },
};
