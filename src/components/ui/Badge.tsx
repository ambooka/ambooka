import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children }) => {
  const baseStyles = 'inline-flex items-center px-2 py-1 text-xs font-medium rounded';
  const variantStyles = variant === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white';

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;