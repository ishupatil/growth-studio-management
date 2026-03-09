'use client'
import * as React from 'react'
import { GeneratedPlan } from '@/lib/types'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { BookmarkPlus, Copy } from 'lucide-react'

interface PlanTabsProps {
    plan: GeneratedPlan
    onSave?: () => void
    isSaving?: boolean
    hideSave?: boolean
}

export function PlanTabs({ plan, onSave, isSaving = false, hideSave = false }: PlanTabsProps) {
    const [activeTab, setActiveTab] = React.useState<'audit' | 'strategy' | 'calendar' | 'captions' | 'tips'>('audit')
    const [copied, setCopied] = React.useState(false)

    const tabs = [
        { id: 'audit', label: 'Audit', content: plan.audit_report },
        { id: 'strategy', label: 'Strategy', content: plan.growth_strategy },
        { id: 'calendar', label: 'Calendar', content: plan.content_calendar },
        { id: 'captions', label: 'Captions', content: plan.captions_hashtags },
        { id: 'tips', label: 'Tips', content: plan.extra_tips },
    ] as const

    const activeContent = tabs.find((t) => t.id === activeTab)?.content || ''

    const copyToClipboard = () => {
        navigator.clipboard.writeText(activeContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Simple Markdown formatter to make output look decent
    const formatContent = (text: string) => {
        if (!text) return null
        return text.split('\n').map((line, i) => {
            if (line.startsWith('## ') || line.startsWith('**') || line.match(/^[A-Z\s]+:/) || line.includes('DAY')) {
                return <h3 key={i} className="text-accent font-medium mt-4 mb-2">{line.replace(/[*#]/g, '')}</h3>
            }
            if (line.startsWith('- ') || line.startsWith('• ')) {
                return <li key={i} className="ml-4 mb-1">{line.substring(2)}</li>
            }
            if (line.trim() === '') {
                return <br key={i} />
            }
            return <p key={i} className="mb-2">{line.replace(/[*#]/g, '')}</p>
        })
    }

    return (
        <Card className="flex flex-col h-full overflow-hidden border-border bg-[#0a0a0a]">
            <div className="flex border-b border-border bg-surface p-2 space-x-2 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-accent/10 text-accent'
                                : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
                <div className="flex-1" />
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="shrink-0" title="Copy Content">
                    <Copy size={16} className={copied ? 'text-success' : ''} />
                </Button>
                {!hideSave && onSave && (
                    <Button variant="primary" size="sm" onClick={onSave} isLoading={isSaving} className="shrink-0">
                        <BookmarkPlus size={16} className="mr-2" /> Save Plan
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed text-text-primary">
                <ul className="list-disc list-inside">
                    {formatContent(activeContent)}
                </ul>
            </div>
        </Card>
    )
}
