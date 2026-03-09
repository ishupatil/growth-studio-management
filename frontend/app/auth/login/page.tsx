import { LoginForm } from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Log In - AI Social Media Growth Team',
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background text-text-primary flex">
            {/* Left side branding */}
            <div className="hidden lg:flex w-1/2 bg-surface flex-col justify-between p-12 border-r border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col h-full">
                    <div>
                        <h1 className="text-2xl font-display font-bold">✦ GrowthAI</h1>
                    </div>

                    <div className="my-auto">
                        <h2 className="text-4xl font-display font-medium text-balance mb-6">
                            Welcome back to your growth engine.
                        </h2>
                        <p className="text-lg text-text-secondary text-balance">
                            Sign in to access your AI-generated strategies, audit reports, and content calendars. Let's keep building your audience.
                        </p>
                    </div>

                    <div className="border border-border/50 rounded-xl p-6 bg-background/50 backdrop-blur-sm">
                        <p className="italic text-text-secondary">
                            "GrowthAI entirely transformed how I approach Instagram. The 7-day strategy agents are spot on every time."
                        </p>
                        <p className="mt-4 font-medium">— Sarah J., Brand Consultant</p>
                    </div>
                </div>
            </div>

            {/* Right side form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-12 text-center">
                        <h1 className="text-3xl font-display font-bold text-accent">✦ GrowthAI</h1>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
