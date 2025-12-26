type BadgeVariant = 'blue' | 'green' | 'purple' | 'orange' | 'gray' | 'red';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  green: 'bg-green-500/20 text-green-300 border border-green-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  orange: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  gray: 'bg-white/10 text-white/70 border border-white/20',
  red: 'bg-red-500/20 text-red-300 border border-red-500/30',
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
