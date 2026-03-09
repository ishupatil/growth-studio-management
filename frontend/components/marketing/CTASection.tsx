import Link from 'next/link'
import { Button } from '../ui/Button'

export function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/5"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1/2 bg-accent/10 rounded-full blur-[100px] -z-10"></div>

            <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                <h2 className="text-5xl font-display font-medium text-text-primary mb-6">
                    Ready to Grow Your Instagram?
                </h2>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
                    Stop guessing what to post. Let our AI crew build your personalized strategy today.
                </p>

                <Link href="/auth/signup">
                    <Button size="lg" className="px-10 rounded-full text-lg shadow-lg shadow-accent/20">
                        Create Free Account <span className="ml-2">→</span>
                    </Button>
                </Link>

                <p className="mt-8 text-sm text-text-secondary opacity-70">
                    Powered by CrewAI · Llama 3.1 · Render.com
                </p>
            </div>
        </section>
    )
}
