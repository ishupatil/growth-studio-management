import { createClient } from '@/lib/supabase/server'
import { SavedPlansList } from '@/components/dashboard/SavedPlansList'

export default async function SavedPlansPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: plans } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-medium">Saved Plans</h1>
                <p className="text-text-secondary mt-1">Review your previously generated 7-day growth strategies.</p>
            </div>

            <SavedPlansList initialPlans={plans || []} />
        </div>
    )
}
