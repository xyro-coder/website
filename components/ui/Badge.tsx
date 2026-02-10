import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'cyan' | 'purple' | 'outline'
}

export default function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-light-surface dark:bg-navy-surface text-text-dark dark:text-text-light':
            variant === 'default',
          'bg-cyan-accent/20 text-cyan-accent-light dark:text-cyan-accent':
            variant === 'cyan',
          'bg-purple-accent/20 text-purple-accent-light dark:text-purple-accent':
            variant === 'purple',
          'border border-text-muted-light/40 dark:border-text-muted/40 text-text-muted-light dark:text-text-muted':
            variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
