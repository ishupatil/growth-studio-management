import Link from 'next/link'
import { Button } from '../ui/Button'

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-display font-bold text-accent">✦</span>
                    <span className="text-xl font-display font-medium text-text-primary">GrowthAI</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-secondary">
                    <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</Link>
                    <Link href="#examples" className="hover:text-text-primary transition-colors">Examples</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/auth/login">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button variant="primary" size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
