import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({ variant = 'default', size = 'md', className = '', children, ...props }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}

export function PriceBadge({ price, originalPrice, className = '' }: { price: number; originalPrice?: number; className?: string }) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice! - price) / originalPrice!) * 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-lg font-bold text-gray-900">${price.toLocaleString('es-CL')}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-gray-400 line-through">${originalPrice!.toLocaleString('es-CL')}</span>
          <Badge variant="success" size="sm">-{discountPercentage}%</Badge>
        </>
      )}
    </div>
  );
}
