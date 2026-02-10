import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-cyan-accent focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent text-white hover:shadow-lg hover:scale-105':
              variant === 'primary',
            'bg-light-surface dark:bg-navy-surface text-text-dark dark:text-text-light hover:bg-text-muted-light/20 dark:hover:bg-text-muted/20':
              variant === 'secondary',
            'border-2 border-cyan-accent-light dark:border-cyan-accent text-cyan-accent-light dark:text-cyan-accent hover:bg-cyan-accent-light/10 dark:hover:bg-cyan-accent/10':
              variant === 'outline',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
