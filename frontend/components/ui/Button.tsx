import * as React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

export function Button({
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50'

    const variants = {
        primary: 'bg-accent text-white hover:bg-accent/90',
        ghost: 'hover:bg-elevated hover:text-text-primary text-text-secondary',
        danger: 'bg-error text-white hover:bg-error/90'
    }

    const sizes = {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 py-2',
        lg: 'h-14 px-8 text-lg'
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
}
