export function HowItWorksSection() {
    const steps = [
        {
            number: '01',
            title: 'Enter Your Stats',
            description: 'Tell us about your account, niche, engagement rates, and growth goals.'
        },
        {
            number: '02',
            title: 'CrewAI Audits Account',
            description: 'The first agent runs an deep analysis on your current performance.'
        },
        {
            number: '03',
            title: 'Agents Build Strategy',
            description: 'The remaining agents generate your calendar, content, and captions.'
        },
        {
            number: '04',
            title: 'Execute and Grow',
            description: 'Follow your personalized 7-day plan and watch your audience grow.'
        }
    ]

    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-display font-medium text-text-primary">
                        How It Works
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto relative">
                    <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-px border-b-2 border-dashed border-border z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className="w-[88px] h-[88px] rounded-full bg-surface border border-border flex items-center justify-center text-2xl font-display font-bold text-accent mb-6 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-medium text-text-primary mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
