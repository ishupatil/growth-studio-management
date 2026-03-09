'use client'
import * as React from 'react'

export function ExampleOutputSection() {
    const [activeTab, setActiveTab] = React.useState('audit')

    const tabs = [
        { id: 'audit', label: 'Audit Report' },
        { id: 'calendar', label: '7-Day Calendar' },
        { id: 'captions', label: 'Captions & Tags' }
    ]

    return (
        <section id="examples" className="py-24 bg-surface border-y border-border">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-display font-medium text-text-primary">
                        See the the output
                    </h2>
                    <p className="mt-4 text-text-secondary text-lg">
                        Real, actionable strategies generated in minutes. No generic fluff.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-background overflow-hidden shadow-2xl">
                    <div className="flex border-b border-border bg-surface/50 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'border-b-2 border-accent text-accent bg-background'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-background/50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 font-mono text-sm leading-relaxed text-text-secondary bg-[#0a0a0a]">
                        {activeTab === 'audit' && (
                            <div>
                                <span className="text-accent">## ENGAGEMENT ANALYSIS</span><br />
                                Rate: 4.2% (Excellent)<br />
                                Benchmark: Tech/Coding niche average is 2.8%<br /><br />
                                <span className="text-accent">## STRENGTHS</span><br />
                                - High comment ratio indicates strong community loyalty<br />
                                - Carousel posts are significantly outperforming single images<br />
                                - Consistent posting schedule maintains algorithm trust<br /><br />
                                <span className="text-accent">## GROWTH PROJECTION</span><br />
                                Current trajectory: 6 months to 10k.<br />
                                Optimized trajectory: 3 months to 10k by doubling down on short-form educational Reels.
                            </div>
                        )}

                        {activeTab === 'calendar' && (
                            <div>
                                <span className="text-accent">## DAY 1</span><br />
                                Type: Reel (Educational)<br />
                                Hook: "3 Python libraries you didn't know existed (and how to use them)"<br />
                                Outline:<br />
                                1. Intro hook visually showing code<br />
                                2. Library 1: Rich (terminal formatting)<br />
                                3. Library 2: Pendulum (datetime made easy)<br />
                                4. CTA: "Save this for your next project"<br />
                                Time: 11:30 AM EST<br /><br />
                                <span className="text-accent">## DAY 2</span><br />
                                Type: Carousel (Tutorial)<br />
                                Idea: Step-by-step API integration guide<br />
                                ...
                            </div>
                        )}

                        {activeTab === 'captions' && (
                            <div>
                                <span className="text-accent">## DAY 1 CAPTION</span><br />
                                Stop writing messy terminal scripts. 🛑👇<br /><br />
                                As Python devs, we often ignore UI... but these 3 libraries honestly make building CLIs fun again. I've been using Rich everywhere lately.<br /><br />
                                Which one is your favorite? Let me know below! 🚀<br /><br />
                                Save this post to remember them later! 💾<br /><br />
                                <span className="text-accent">## DAY 1 HASHTAGS</span><br />
                                #python #programming #coding #softwareengineer #developer<br />
                                #pythonprogramming #codinglife #techcareers #webdev #backend<br />
                                #pythonlibraries #pythoncode #learnpython #codingtips #devcommunity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
