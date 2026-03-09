import { Navbar } from '@/components/marketing/Navbar'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeaturesSection } from '@/components/marketing/FeaturesSection'
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection'
import { ExampleOutputSection } from '@/components/marketing/ExampleOutputSection'
import { CTASection } from '@/components/marketing/CTASection'

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-accent/30 selection:text-white">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <ExampleOutputSection />
                <CTASection />
            </main>

            <footer className="border-t border-border/40 py-8 bg-surface text-center text-sm text-text-secondary">
                <div className="container mx-auto px-4">
                    <p>© {new Date().getFullYear()} GrowthAI. Powered by CrewAI + Llama 3.1 on Render.com</p>
                </div>
            </footer>
        </div>
    )
}
