import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-[#382338] border border-rose-200 dark:border-[#4D2E4D] rounded-2xl text-rose-800 dark:text-[#F48FB1] shadow-xs">
      <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-[#F4435A] dark:text-[#F48FB1]" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
