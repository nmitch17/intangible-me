interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`chart-card p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-white font-mono tracking-wide uppercase text-sm">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
