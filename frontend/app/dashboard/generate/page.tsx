'use client'
import * as React from 'react'
import { GrowthForm } from '@/components/dashboard/GrowthForm'
import { PlanTabs } from '@/components/dashboard/PlanTabs'
import { GrowthFormData, GeneratedPlan } from '@/lib/types'

export default function GeneratePage() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [plan, setPlan] = React.useState<GeneratedPlan | null>(null)
    const [isSaving, setIsSaving] = React.useState(false)
    const [savedData, setSavedData] = React.useState<GrowthFormData | null>(null)

    const handleGenerate = async (data: GrowthFormData) => {
        setIsLoading(true)
        setPlan(null)
        setSavedData(data)

        try {
            const res = await fetch('/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                const contentType = res.headers.get('content-type')
                if (contentType && contentType.includes('application/json')) {
                    const error = await res.json()
                    throw new Error(error.error || 'Failed to generate')
                } else {
                    const text = await res.text()
                    throw new Error(`Server Error (${res.status}): ${text.substring(0, 100)}...`)
                }
            }

            const contentType = res.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text()
                throw new Error(`Expected JSON but got HTML: ${text.substring(0, 100)}...`)
            }

            const result = await res.json()
            setPlan(result.data)
        } catch (err: any) {
            alert(err.message || 'An error occurred during generation.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!plan || !savedData) return
        setIsSaving(true)

        try {
            const payload = {
                ...savedData,
                ...plan
            }

            const res = await fetch('/api/save-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error('Failed to save')

            alert('Plan saved successfully! View it in your Saved Plans.')
        } catch (err) {
            alert('Failed to save plan.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex gap-6">
            <div className={`transition-all duration-500 flex-shrink-0 ${plan ? 'w-[40%]' : 'w-full max-w-2xl mx-auto'}`}>
                <GrowthForm onSubmit={handleGenerate} isLoading={isLoading} />
            </div>

            {plan && (
                <div className="w-[60%] h-full animate-in fade-in slide-in-from-right-4 duration-500">
                    <PlanTabs plan={plan} onSave={handleSave} isSaving={isSaving} />
                </div>
            )}
        </div>
    )
}
