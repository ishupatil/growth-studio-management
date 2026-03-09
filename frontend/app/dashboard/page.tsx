import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Bot, FileText, Activity, Users } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

    // Fetch recent plans
    const { data: plans } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3)

    // Fetch unique profiles
    const { data: profiles } = await supabase
        .from('influencer_profiles')
        .select('*')
        .eq('user_id', user?.id)

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

    // Calculate days active
    const created = new Date(user?.created_at || new Date())
    const daysActive = Math.max(1, Math.floor((new Date().getTime() - created.getTime()) / (1000 * 3600 * 24)))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-medium">Good {greeting}, {name}!</h1>
                <p className="text-text-secondary mt-1">Here is the overview of your growth engine operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-accent/10 text-accent rounded-lg"><FileText size={24} /></div>
                        <div>
                            <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Plans Generated</p>
                            <p className="text-2xl font-bold">{plans?.length || 0}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-success/10 text-success rounded-lg"><Bot size={24} /></div>
                        <div>
                            <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">AI Model</p>
                            <p className="text-lg font-bold">Llama 3.1 8B</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg"><Users size={24} /></div>
                        <div>
                            <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Profiles Analysed</p>
                            <p className="text-2xl font-bold">{profiles?.length || 0}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg"><Activity size={24} /></div>
                        <div>
                            <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Days Active</p>
                            <p className="text-2xl font-bold">{daysActive}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex justify-between items-end border-b border-border pb-4">
                <div>
                    <h2 className="text-xl font-display font-medium">Recent Plans</h2>
                    <p className="text-sm text-text-secondary">Your latest generated 7-day strategies.</p>
                </div>
                <Link href="/dashboard/generate">
                    <Button variant="primary">Generate New Plan <span className="ml-2">→</span></Button>
                </Link>
            </div>

            {plans && plans.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {plans.map((plan: any) => (
                        <Card key={plan.id} className="p-6 flex items-center justify-between" hover>
                            <div>
                                <h3 className="font-medium text-lg text-accent">@{plan.instagram_username}</h3>
                                <p className="text-sm text-text-secondary mt-1">
                                    Generated on {new Date(plan.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <Link href="/dashboard/saved">
                                <Button variant="ghost" size="sm">View <span className="ml-1">→</span></Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed">
                    <FileText className="h-12 w-12 text-text-secondary mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No plans generated yet</h3>
                    <p className="text-text-secondary mb-6 max-w-sm">
                        Put our 4 AI agents to work. Enter your Instagram stats and get a personalized 7-day strategy.
                    </p>
                    <Link href="/dashboard/generate">
                        <Button>Generate Your First Plan</Button>
                    </Link>
                </Card>
            )}
        </div>
    )
}
