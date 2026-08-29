import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:scale-[0.98] shadow-lg shadow-primary/25',
  secondary:
    'bg-white text-ink border border-ink/10 hover:border-primary/40 hover:text-primary active:scale-[0.98]',
  ghost: 'bg-transparent text-muted hover:text-ink hover:bg-ink/5 active:scale-[0.98]',
};

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none ${
        VARIANT_CLASSES[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
