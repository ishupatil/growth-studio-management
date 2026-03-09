'use client'
import * as React from 'react'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { GrowthFormData } from '@/lib/types'

interface GrowthFormProps {
    onSubmit: (data: GrowthFormData) => void
    isLoading: boolean
}

export function GrowthForm({ onSubmit, isLoading }: GrowthFormProps) {
    const [step, setStep] = React.useState(0)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)

        onSubmit({
            username: fd.get('username') as string,
            followers: parseInt(fd.get('followers') as string) || 0,
            avg_likes: parseInt(fd.get('avg_likes') as string) || 0,
            avg_comments: parseInt(fd.get('avg_comments') as string) || 0,
            posting_frequency: parseInt(fd.get('posting_frequency') as string) || 0,
            content_type: fd.get('content_type') as string,
            brand_tone: fd.get('brand_tone') as string,
            goal: fd.get('goal') as string,
            target_followers: parseInt(fd.get('target_followers') as string) || 0,
        })
    }

    // Effect to simulate steps progressing during load
    React.useEffect(() => {
        if (!isLoading) {
            setStep(0)
            return
        }

        const interval = setInterval(() => {
            setStep((s) => (s >= 3 ? 3 : s + 1))
        }, 15000) // Move step every 15s since CrewAI takes ~1m total

        return () => clearInterval(interval)
    }, [isLoading])

    const loadingSteps = [
        "Agent 01 — Auditing your account...",
        "Agent 02 — Building strategy...",
        "Agent 03 — Creating content calendar...",
        "Agent 04 — Writing captions..."
    ]

    return (
        <Card className="p-6 h-full flex flex-col">
            <h2 className="text-xl font-display font-medium mb-6">Account Profile</h2>

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                    <LoadingSpinner size="lg" />
                    <div className="w-full max-w-xs space-y-4">
                        {loadingSteps.map((text, idx) => (
                            <div
                                key={idx}
                                className={`text-sm transition-all duration-500 flex items-center ${idx === step
                                    ? 'text-accent font-medium scale-105'
                                    : idx < step
                                        ? 'text-success opacity-70'
                                        : 'text-text-secondary opacity-40'
                                    }`}
                            >
                                {idx < step && <span className="mr-2 text-success">✓</span>}
                                {idx === step && <LoadingSpinner size="sm" className="mr-2" />}
                                {idx > step && <span className="mr-2 w-4 inline-block"></span>}
                                {text}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-text-secondary text-center mt-8 italic">
                        Please wait. AI generation usually takes 1-2 minutes.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="username" label="Instagram Username" placeholder="your_handle" required />
                        <Input name="followers" type="number" label="Current Followers" placeholder="1500" required />
                        <Input name="avg_likes" type="number" label="Average Likes" placeholder="150" required />
                        <Input name="avg_comments" type="number" label="Average Comments" placeholder="15" required />
                        <Input name="posting_frequency" type="number" label="Posts Per Week" placeholder="3" required />
                        <Input name="target_followers" type="number" label="Target Followers" placeholder="10000" required />
                    </div>

                    <div className="space-y-4 pt-2">
                        <div>
                            <label className="text-sm font-medium text-text-primary mb-2 block">Content Niche/Type</label>
                            <select name="content_type" className="w-full h-11 rounded-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" required>
                                <option value="Educational / Tutorials">Educational / Tutorials</option>
                                <option value="Lifestyle / Vlog">Lifestyle / Vlog</option>
                                <option value="Entertainment / Comedy">Entertainment / Comedy</option>
                                <option value="Business / Marketing">Business / Marketing</option>
                                <option value="Fitness / Health">Fitness / Health</option>
                                <option value="Tech / Coding">Tech / Coding</option>
                                <option value="Fashion / Beauty">Fashion / Beauty</option>
                                <option value="Food / Cooking">Food / Cooking</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-text-primary mb-2 block">Brand Tone</label>
                            <select name="brand_tone" className="w-full h-11 rounded-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" required>
                                <option value="Professional and Authoritative">Professional & Authoritative</option>
                                <option value="Casual and Friendly">Casual & Friendly</option>
                                <option value="Humorous and Witty">Humorous & Witty</option>
                                <option value="Inspirational and Motivating">Inspirational & Motivating</option>
                                <option value="Direct and Bold">Direct & Bold</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-text-primary mb-2 block">Primary Goal</label>
                            <select name="goal" className="w-full h-11 rounded-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" required>
                                <option value="Increase reach and viral growth">Viral Growth & Reach</option>
                                <option value="Build community and engagement">Community & Engagement</option>
                                <option value="Drive sales and conversions">Sales & Conversions</option>
                                <option value="Establish industry authority">Establish Authority</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Agents at Work...' : 'Engage AI Agents'} <span className="ml-2">→</span>
                        </Button>
                    </div>
                </form>
            )}
        </Card>
    )
}
