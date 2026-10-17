import { formatDistanceToNow, format } from 'date-fns';

export function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatDate(dateStr: string, fmt = 'MMM d, yyyy'): string {
  try {
    return format(new Date(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatAge(ageYears: number | null, ageMonths: number | null): string {
  if (ageYears === null && ageMonths === null) return 'Age unknown';
  const years = ageYears ?? 0;
  const months = ageMonths ?? 0;
  if (years === 0 && months === 0) return 'Less than 1 month';
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years} yr ${months} mo`;
}

export function truncate(text: string, maxLen: number): string {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '...';
}
