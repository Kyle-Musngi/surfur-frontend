import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'green' | 'yellow' | 'orange' | 'gray' | 'red' | 'blue' | 'pink' | 'mint' | 'rose' | 'magenta';
}

const variantClasses: Record<string, string> = {
  mint: 'bg-[#FFEBF1] text-[#C62845] border-[#F1D5DF] dark:bg-[#253826] dark:text-[#DDF5D5] dark:border-[#38523a]',
  green: 'bg-[#FFEBF1] text-[#C62845] border-[#F1D5DF] dark:bg-[#253826] dark:text-[#DDF5D5] dark:border-[#38523a]',
  pink: 'bg-[#FCE4EC] text-[#FF81AB] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#F48FB1] dark:border-[#4D2E4D]',
  rose: 'bg-[#FCE4EC] text-[#F4435A] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#F48FB1] dark:border-[#4D2E4D]',
  magenta: 'bg-[#FCE4EC] text-[#E94EAA] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#E94EAA] dark:border-[#4D2E4D]',
  yellow: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/50',
  orange: 'bg-[#FCE4EC] text-[#E94EAA] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#F48FB1] dark:border-[#4D2E4D]',
  gray: 'bg-[#FCE4EC] text-[#786875] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#C9B8C7] dark:border-[#4D2E4D]',
  red: 'bg-[#FCE4EC] text-[#F4435A] border-[#F1D5DF] dark:bg-[#382338] dark:text-[#F4435A] dark:border-[#4D2E4D]',
  blue: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-800/50',
};

export function Badge({ children, className = '', variant = 'gray' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
