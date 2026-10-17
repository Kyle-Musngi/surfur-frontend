import type { PaginatedResponse } from '../types';

/**
 * Normalizes an API response that can either be:
 * 1. A paginated DRF response: { count: number, next: string | null, previous: string | null, results: T[] }
 * 2. A direct array of items: T[]
 * 3. Null / undefined / empty
 *
 * Always returns a validated array of type T[], preventing ".map is not a function" crashes.
 */
export function extractResults<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if ('results' in obj && Array.isArray(obj.results)) {
      return obj.results as T[];
    }

    if (import.meta.env.DEV) {
      console.warn('[SurFur API] Unexpected data structure encountered when expecting array or { results: [] }:', data);
    }
  }

  return [];
}

/**
 * Normalizes a response into a standard PaginatedResponse structure.
 */
export function normalizePaginatedResponse<T>(data: unknown): PaginatedResponse<T> {
  if (!data) {
    return { count: 0, next: null, previous: null, results: [] };
  }

  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    };
  }

  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    const results = Array.isArray(obj.results) ? (obj.results as T[]) : [];
    return {
      count: typeof obj.count === 'number' ? obj.count : results.length,
      next: typeof obj.next === 'string' ? obj.next : null,
      previous: typeof obj.previous === 'string' ? obj.previous : null,
      results,
    };
  }

  return { count: 0, next: null, previous: null, results: [] };
}
