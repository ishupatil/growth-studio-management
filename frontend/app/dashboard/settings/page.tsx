'use client'
import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Mail, Key, User } from 'lucide-react'

export default function SettingsPage() {
    const supabase = createClient()
    const [isLoading, setIsLoading] = React.useState(true)
    const [isUpdating, setIsUpdating] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)

    React.useEffect(() => {
        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setIsLoading(false)
        }
        loadUser()
    }, [])

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsUpdating(true)

        const fd = new FormData(e.currentTarget)
        const fullName = fd.get('fullName') as string
        const newPassword = fd.get('password') as string

        try {
            const updates: any = {}
            if (fullName && fullName !== user?.user_metadata?.full_name) {
                updates.data = { full_name: fullName }
            }
            if (newPassword) {
                if (newPassword.length < 8) {
                    throw new Error('Password must be at least 8 characters')
                }
                updates.password = newPassword
            }

            if (Object.keys(updates).length > 0) {
                const { error } = await supabase.auth.updateUser(updates)
                if (error) throw error
                alert('Settings updated successfully!')
            }

        } catch (err: any) {
            alert(err.message || 'Failed to update settings')
        } finally {
            setIsUpdating(false)
            // Clear password field
            const form = e.target as HTMLFormElement
            form.password.value = ''
        }
    }

    if (isLoading) {
        return <div className="h-40 flex items-center justify-center text-text-secondary">Loading settings...</div>
    }

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-3xl font-display font-medium">Account Settings</h1>
                <p className="text-text-secondary mt-1">Manage your profile and account security preferences.</p>
            </div>

            <Card className="p-8">
                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b border-border pb-2 flex items-center">
                            <User className="mr-2 h-5 w-5 text-accent" /> Profile Information
                        </h3>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Input
                                    name="fullName"
                                    label="Full Name"
                                    defaultValue={user?.user_metadata?.full_name || ''}
                                />
                                <p className="text-xs text-text-secondary">This is your public display name.</p>
                            </div>

                            <div className="space-y-2 relative">
                                <div className="absolute right-3 top-9 text-text-secondary">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <Input
                                    name="email"
                                    label="Email Address"
                                    defaultValue={user?.email || ''}
                                    disabled
                                    className="bg-background opacity-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-text-secondary">Your email cannot be changed here.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b border-border pb-2 flex items-center">
                            <Key className="mr-2 h-5 w-5 text-accent" /> Security
                        </h3>

                        <div className="max-w-md space-y-2 relative">
                            <Input
                                name="password"
                                type="password"
                                label="New Password"
                                placeholder="Leave blank to keep current"
                            />
                            <p className="text-xs text-text-secondary w-full">Must be at least 8 characters long.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end">
                        <Button type="submit" isLoading={isUpdating}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>

            <div className="text-sm text-text-secondary text-center">
                GrowthAI ID: {user?.id} <br />
                Account created: {new Date(user?.created_at || '').toLocaleDateString()}
            </div>
        </div>
    )
}
