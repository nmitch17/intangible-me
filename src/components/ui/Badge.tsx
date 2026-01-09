type BadgeVariant = 'blue' | 'green' | 'purple' | 'orange' | 'gray' | 'red' | 'solar' | 'pink';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-100 text-blue-700 border border-blue-200',
  green: 'bg-green-100 text-green-700 border border-green-200',
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
  orange: 'bg-orange-100 text-orange-700 border border-orange-200',
  gray: 'bg-gray-100 text-gray-600 border border-gray-200',
  red: 'bg-red-100 text-red-700 border border-red-200',
  solar: 'bg-gradient-to-r from-solar-glow/20 to-haze-pink/20 text-deep-cosmos border border-solar-glow/30',
  pink: 'bg-haze-pink/20 text-deep-cosmos border border-haze-pink/30',
};

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
