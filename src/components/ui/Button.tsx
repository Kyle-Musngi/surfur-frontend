import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-[#D4FFC6] hover:bg-[#bdf8ab] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent font-bold shadow-xs',
  secondary: 'bg-[#FFEBF1] hover:bg-[#ffd6e4] text-[#352633] border border-[#FF81AB]/30 dark:bg-[#382338] dark:hover:bg-[#4a2e4a] dark:text-[#FCE4EC] dark:border-transparent shadow-xs font-semibold',
  outline: 'border-2 border-[#FF81AB] text-[#FF81AB] hover:bg-[#FFEBF1] dark:border-[#F48FB1] dark:text-[#F48FB1] dark:hover:bg-[#F48FB1] dark:hover:text-[#1E121E] font-bold',
  ghost: 'text-[#FF81AB] hover:bg-[#FFEBF1] dark:text-[#F48FB1] dark:hover:bg-[#382338] border border-transparent font-semibold',
  danger: 'bg-[#F4435A] hover:bg-[#C62845] text-white shadow-sm border border-transparent font-bold',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 cursor-pointer
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF81AB] focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
