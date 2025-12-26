interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`chart-card p-6 ${className}`}>
      {title && (
        <h3 className="text-sm font-mono font-medium mb-4 text-solar-glow tracking-wider uppercase">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
