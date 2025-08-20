import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.ComponentProps<'input'> {
  leftIcon?: LucideIcon;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leftIcon: LeftIcon, rightIcon: RightIcon, error = false, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {LeftIcon && <LeftIcon className={cn('absolute left-3 h-4 w-4 text-gray-400')} />}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200',
            'border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:bg-gray-50',
            error ? 'border-red-500 focus:ring-red-500' : '',
            'disabled:cursor-not-allowed disabled:opacity-50',
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {RightIcon && <div className="absolute right-3">{RightIcon}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };