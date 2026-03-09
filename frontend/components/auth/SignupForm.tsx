'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import Link from 'next/link'

export function SignupForm() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState('')
    const [passwordStrength, setPasswordStrength] = React.useState(0)

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        let strength = 0
        if (val.length >= 8) strength += 25
        if (/[A-Z]/.test(val)) strength += 25
        if (/[a-z]/.test(val)) strength += 25
        if (/[0-9]/.test(val)) strength += 25
        setPasswordStrength(strength)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const fullName = formData.get('fullName') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            setIsLoading(false)
            return
        }

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        })

        if (signUpError) {
            setError(signUpError.message)
            setIsLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 p-8 bg-surface rounded-2xl border border-border">
            <div className="text-center">
                <h2 className="text-3xl font-display font-medium">Create an account</h2>
                <p className="mt-2 text-text-secondary">Start growing your Instagram today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    label="Full Name"
                    placeholder="Jane Doe"
                    required
                />
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    required
                />

                <div className="space-y-2">
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        onChange={handlePasswordChange}
                        required
                    />
                    {passwordStrength > 0 && (
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${passwordStrength < 50 ? 'bg-error' : passwordStrength < 100 ? 'bg-accent' : 'bg-success'
                                    }`}
                                style={{ width: `${passwordStrength}%` }}
                            />
                        </div>
                    )}
                </div>

                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    required
                />

                {error && (
                    <div className="p-3 text-sm rounded bg-error/10 text-error border border-error/20">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Sign Up
                </Button>
            </form>

            <p className="text-center text-sm text-text-secondary">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-accent hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    )
}
