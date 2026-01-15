import * as React from "react";


const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className = '', type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border px-3 py-2 text-base 
          file:border-0 file:bg-transparent file:text-sm file:font-medium
          disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
          transition-all duration-200
          ${className}`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-medium)',
          color: 'var(--text-primary)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.15)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-medium)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
