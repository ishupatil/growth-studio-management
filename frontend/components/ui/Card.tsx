import * as React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

export function Card({ className = '', hover = false, children, ...props }: CardProps) {
    return (
        <div
            className={`rounded-xl border border-border bg-elevated text-text-primary shadow-sm ${hover ? 'transition-all hover:border-accent/50 hover:shadow-md' : ''
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
