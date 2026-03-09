export function FeaturesSection() {
    const agents = [
        {
            id: '01',
            title: 'Instagram Audit Specialist',
            description: 'Analyzes your current engagement, benchmarks it against your niche, and identifies key strengths and weaknesses.',
            icon: '📊'
        },
        {
            id: '02',
            title: 'Growth Strategy Planner',
            description: 'Builds a data-backed 7-day posting schedule, content mix, and specific algorithm tactics designed for your goal.',
            icon: '📈'
        },
        {
            id: '03',
            title: 'Content Creation Expert',
            description: 'Generates specific viral hooks, post outlines, and formats tailored to your content type and brand tone.',
            icon: '✨'
        },
        {
            id: '04',
            title: 'Caption & Hashtag Specialist',
            description: 'Writes engaging captions with clear CTAs and provides layered hashtag sets (broad, niche, micro) for every day.',
            icon: '✍️'
        }
    ]

    return (
        <section id="features" className="py-24 bg-surface border-y border-border">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="text-accent text-sm font-bold tracking-widest uppercase mb-3">The Crew</div>
                    <h2 className="text-4xl font-display font-medium text-text-primary">
                        4 CrewAI Agents Working For You
                    </h2>
                    <p className="mt-4 text-text-secondary text-lg">
                        Our multi-agent system uses sequential intelligence. Each agent builds upon the work of the previous one to create a cohesive, personalized strategy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {agents.map((agent) => (
                        <div key={agent.id} className="relative p-8 rounded-2xl border border-border bg-background hover:border-accent/50 transition-colors group overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 font-display font-bold">
                                {agent.id}
                            </div>
                            <div className="text-4xl mb-6 relative z-10">{agent.icon}</div>
                            <h3 className="text-xl font-medium text-text-primary mb-3 relative z-10">
                                Agent {agent.id} — {agent.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed relative z-10">
                                {agent.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
