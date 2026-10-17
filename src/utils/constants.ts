export const SPECIES_LABELS: Record<string, string> = {
  dog: '🐶 Dog',
  cat: '🐱 Cat',
  other: '🐾 Other',
};

export const STATUS_COLORS: Record<string, string> = {
  available: 'bg-[#FFEBF1] text-[#C62845] border-[#F1D5DF] dark:bg-[#253826] dark:text-[#DDF5D5] dark:border-[#38523a]',
  pending: 'bg-[#FCE4EC] text-[#E94EAA] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#F48FB1] dark:border-[#4D2E4D]',
  adopted: 'bg-[#FCE4EC] text-[#786875] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#C9B8C7] dark:border-[#4D2E4D]',
  hold: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/50',
  unavailable: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800/50',
};

export const VERIFICATION_COLORS: Record<string, string> = {
  verified: 'bg-[#FFEBF1] text-[#C62845] border-[#F1D5DF] dark:bg-[#253826] dark:text-[#DDF5D5] dark:border-[#38523a]',
  unverified: 'bg-[#FCE4EC] text-[#786875] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#C9B8C7] dark:border-[#4D2E4D]',
  pending: 'bg-[#FCE4EC] text-[#E94EAA] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#F48FB1] dark:border-[#4D2E4D]',
  rejected: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800/50',
  suspended: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800/50',
};

export const INQUIRY_STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  more_info: 'More Information Needed',
  visit_requested: 'Visit Requested',
  approved: 'Approved',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
  completed: 'Completed',
};

export const INQUIRY_STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200',
  under_review: 'bg-[#FCE4EC] text-[#E94EAA] dark:bg-[#382338] dark:text-[#F48FB1]',
  more_info: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
  visit_requested: 'bg-[#FCE4EC] text-[#C62845] dark:bg-[#382338] dark:text-[#F48FB1]',
  approved: 'bg-[#FFEBF1] text-[#C62845] dark:bg-[#253826] dark:text-[#DDF5D5]',
  declined: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
  withdrawn: 'bg-[#FCE4EC] text-[#786875] dark:bg-[#382338] dark:text-[#C9B8C7]',
  completed: 'bg-[#FFEBF1] text-[#C62845] dark:bg-[#253826] dark:text-[#DDF5D5]',
};

export const DEFAULT_PET_IMAGE = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=450&fit=crop&q=80';
export const DEFAULT_SHELTER_IMAGE = 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=450&fit=crop&q=80';
