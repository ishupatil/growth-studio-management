import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data: profile } = await supabase
        .from('influencer_profiles')
        .insert({
            user_id: user.id,
            username: body.username,
            followers: body.followers,
            avg_likes: body.avg_likes,
            avg_comments: body.avg_comments,
            posting_frequency: body.posting_frequency,
            content_type: body.content_type,
            brand_tone: body.brand_tone,
            goal: body.goal,
            target_followers: body.target_followers,
        })
        .select()
        .single()

    const { data: plan, error } = await supabase
        .from('weekly_plans')
        .insert({
            user_id: user.id,
            profile_id: profile?.id || null,
            instagram_username: body.username,
            audit_report: body.audit_report,
            growth_strategy: body.growth_strategy,
            content_calendar: body.content_calendar,
            captions_hashtags: body.captions_hashtags,
            extra_tips: body.extra_tips || '',
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, plan })
}
