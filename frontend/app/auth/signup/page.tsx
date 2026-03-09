import { SignupForm } from '@/components/auth/SignupForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up - AI Social Media Growth Team',
}

export default function SignupPage() {
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
                            Your 24/7 AI-powered Instagram Growth Team.
                        </h2>
                        <ul className="space-y-4 text-lg text-text-secondary">
                            <li className="flex items-center">
                                <span className="text-accent mr-3">✦</span> Free profile auditions
                            </li>
                            <li className="flex items-center">
                                <span className="text-accent mr-3">✦</span> 7-day personalized content strategies
                            </li>
                            <li className="flex items-center">
                                <span className="text-accent mr-3">✦</span> Captions tailored to your brand voice
                            </li>
                            <li className="flex items-center">
                                <span className="text-accent mr-3">✦</span> Optimized hashtags for your niche
                            </li>
                        </ul>
                    </div>

                    <div className="border border-border/50 rounded-xl p-6 bg-background/50 backdrop-blur-sm">
                        <p className="italic text-text-secondary">
                            "The best part is having 4 specialized AI agents working together on my account for free."
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    <div className="lg:hidden mb-12 text-center">
                        <h1 className="text-3xl font-display font-bold text-accent">✦ GrowthAI</h1>
                    </div>
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}
