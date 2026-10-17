import apiClient from './client';
import type { PaginatedResponse } from '../types';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt: string;
  category_name: string;
  language: string;
  cover_image: string;
  author_name?: string;
  published_at: string;
}

export const articlesApi = {
  list: async (): Promise<PaginatedResponse<Article>> => {
    const res = await apiClient.get('/articles/');
    return res.data;
  },

  detail: async (slug: string): Promise<Article> => {
    const res = await apiClient.get(`/articles/${slug}/`);
    return res.data;
  },
};
