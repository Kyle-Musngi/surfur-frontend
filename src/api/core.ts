import apiClient from './client';
import type { CebuLocation, PaginatedResponse } from '../types';
import { extractResults } from '../utils/apiHelpers';

export const coreApi = {
  getLocations: async (): Promise<CebuLocation[]> => {
    const res = await apiClient.get<CebuLocation[] | PaginatedResponse<CebuLocation>>('/core/locations/');
    return extractResults<CebuLocation>(res.data);
  },

  getConfig: async () => {
    const res = await apiClient.get('/core/config/');
    return res.data;
  },
};
