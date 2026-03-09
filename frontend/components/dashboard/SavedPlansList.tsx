'use client'
import * as React from 'react'
import { WeeklyPlan } from '@/lib/types'
import { Card } from '../ui/Card'
import { PlanTabs } from './PlanTabs'
import { Button } from '../ui/Button'
import { Trash2, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'

interface SavedPlansListProps {
    initialPlans: WeeklyPlan[]
}

export function SavedPlansList({ initialPlans }: SavedPlansListProps) {
    const [plans, setPlans] = React.useState<WeeklyPlan[]>(initialPlans)
    const [expandedId, setExpandedId] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState<string | null>(null)

    const toggleExpand = (id: string) => {
        if (expandedId === id) setExpandedId(null)
        else setExpandedId(id)
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent expand toggle
        if (!confirm('Are you sure you want to delete this specific plan?')) return

        setIsDeleting(id)
        try {
            const res = await fetch(`/api/plans?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete')

            setPlans(plans.filter(p => p.id !== id))
            if (expandedId === id) setExpandedId(null)
        } catch (err) {
            alert('Failed to delete plan')
        } finally {
            setIsDeleting(null)
        }
    }

    if (plans.length === 0) {
        return (
            <div className="text-center p-12 bg-surface border border-border border-dashed rounded-xl">
                <AlertCircle className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No saved plans</h3>
                <p className="text-text-secondary mb-6">You haven't generated or saved any growth plans yet.</p>
                <a href="/dashboard/generate">
                    <Button>Generate Plan</Button>
                </a>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {plans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden transition-all duration-300">
                    <div
                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-elevated/50"
                        onClick={() => toggleExpand(plan.id)}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="text-accent">
                                {expandedId === plan.id ? <ChevronDown /> : <ChevronRight />}
                            </div>
                            <div>
                                <h3 className="font-display text-xl font-medium text-text-primary">
                                    @{plan.instagram_username}
                                </h3>
                                <p className="text-sm text-text-secondary mt-1">
                                    Generated {new Date(plan.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-error hover:bg-error/10 hover:text-error"
                            onClick={(e) => handleDelete(plan.id, e)}
                            isLoading={isDeleting === plan.id}
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>

                    {expandedId === plan.id && (
                        <div className="h-[600px] border-t border-border p-4 bg-background">
                            <PlanTabs
                                plan={plan as any}
                                hideSave
                            />
                        </div>
                    )}
                </Card>
            ))}
        </div>
    )
}
