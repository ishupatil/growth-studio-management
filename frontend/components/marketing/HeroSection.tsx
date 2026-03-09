import Link from 'next/link'
import { Button } from '../ui/Button'

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] -z-10"></div>

            <div className="container mx-auto px-4 md:px-8 text-center">
                <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent backdrop-blur-sm mb-8">
                    <span className="mr-2">✦</span> Powered by CrewAI + Llama 3.1 — Free
                </div>

                <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-text-primary sm:text-6xl lg:text-7xl text-balance">
                    Your Personal AI <span className="text-accent italic">Growth Team</span> for Instagram
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed">
                    4 specialized AI agents analyze your account and generate a complete 7-day strategy. Powered by CrewAI and Llama 3.1. 100% free.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/auth/signup">
                        <Button size="lg" className="w-full sm:w-auto px-8 rounded-full">
                            Generate My Growth Plan <span className="ml-2">→</span>
                        </Button>
                    </Link>
                    <Link href="#examples">
                        <Button variant="ghost" size="lg" className="w-full sm:w-auto px-8 rounded-full border border-border bg-surface/50 backdrop-blur-sm">
                            See Example
                        </Button>
                    </Link>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center p-6 rounded-2xl bg-surface/50 border border-border backdrop-blur-sm">
                        <div className="text-3xl mb-2">🤖</div>
                        <div className="font-medium text-text-primary">4 AI Agents</div>
                        <div className="text-sm text-text-secondary mt-1 text-center">Working in sequence</div>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-2xl bg-surface/50 border border-border backdrop-blur-sm">
                        <div className="text-3xl mb-2">🦙</div>
                        <div className="font-medium text-text-primary">Llama 3.1</div>
                        <div className="text-sm text-text-secondary mt-1 text-center">Powered by Groq</div>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-2xl bg-surface/50 border border-border backdrop-blur-sm">
                        <div className="text-3xl mb-2">📅</div>
                        <div className="font-medium text-text-primary">7-Day Plans</div>
                        <div className="text-sm text-text-secondary mt-1 text-center">Complete daily schedule</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
