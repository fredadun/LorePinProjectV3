import React, { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Define button variants and sizes using class-variance-authority
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark',
        outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'bg-transparent text-primary hover:bg-primary/10',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Extend button props with our variants
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

/**
 * Button component with different variants and sizes
 * @param variant - Button style variant (default, secondary, outline, ghost, link)
 * @param size - Button size (default, sm, lg, icon)
 * @param className - Additional CSS classes
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  className,
  ...props
}) => {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
};

export default Button;