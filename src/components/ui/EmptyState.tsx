import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-[#2A1A2A] rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs">
      {icon && <div className="mb-4 text-[#F48FB1] text-5xl">{icon}</div>}
      <h3 className="text-lg font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">{title}</h3>
      {description && <p className="text-[#786875] dark:text-[#C9B8C7] mb-6 max-w-md text-sm">{description}</p>}
      {action}
    </div>
  );
}
