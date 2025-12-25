type BadgeVariant = 'blue' | 'green' | 'purple' | 'orange' | 'gray' | 'red';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
