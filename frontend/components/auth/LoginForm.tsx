'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import Link from 'next/link'

export function LoginForm() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            setError('Please fill in all fields')
            setIsLoading(false)
            return
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            setError(signInError.message || 'Invalid email or password')
            setIsLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 p-8 bg-surface rounded-2xl border border-border">
            <div className="text-center">
                <h2 className="text-3xl font-display font-medium">Welcome back</h2>
                <p className="mt-2 text-text-secondary">Log in to your AI growth team</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    required
                />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    required
                />

                {error && (
                    <div className="p-3 text-sm rounded bg-error/10 text-error border border-error/20">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Log In
                </Button>
            </form>

            <p className="text-center text-sm text-text-secondary">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-accent hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    )
}
