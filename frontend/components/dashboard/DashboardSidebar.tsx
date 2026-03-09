'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Sparkles, Bookmark, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/Button'

export function DashboardSidebar({ userEmail }: { userEmail: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Generate Plan', href: '/dashboard/generate', icon: Sparkles },
        { name: 'Saved Plans', href: '/dashboard/saved', icon: Bookmark },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/auth/login')
    }

    return (
        <div className="w-64 border-r border-border bg-surface h-screen fixed left-0 top-0 flex flex-col z-10">
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <span className="text-xl font-display font-bold text-accent">✦</span>
                    <span className="text-xl font-display font-medium text-text-primary">GrowthAI</span>
                </Link>
            </div>

            <div className="flex-1 py-6 flex flex-col gap-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-accent/10 text-accent font-medium'
                                    : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'text-accent' : 'opacity-70'} />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-border/50">
                <div className="px-4 py-3 mb-4 rounded-lg bg-elevated border border-border">
                    <p className="text-xs text-text-secondary">Logged in as</p>
                    <p className="text-sm font-medium text-text-primary truncate" title={userEmail}>
                        {userEmail}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-text-secondary hover:text-error hover:bg-error/10"
                    onClick={handleSignOut}
                >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
