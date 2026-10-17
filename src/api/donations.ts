import apiClient from './client';
import type { PaginatedResponse } from '../types';

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  purpose: string;
  target_amount: string | null;
  confirmed_amount: string;
  progress_percent: number | null;
  status: string;
  cover_image: string;
  shelter_name: string;
  pet_name: string | null;
  created_at: string;
}

export const donationsApi = {
  list: async (): Promise<PaginatedResponse<DonationCampaign>> => {
    const res = await apiClient.get('/donations/');
    return res.data;
  },

  detail: async (id: string): Promise<DonationCampaign> => {
    const res = await apiClient.get(`/donations/${id}/`);
    return res.data;
  },
};
