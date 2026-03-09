import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = createClient()

    // Diagnostic logging for Render environment
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('CRITICAL: Supabase environment variables are missing in the Frontend service on Render.')
        return NextResponse.json({
            error: 'Configuration Error: Missing Supabase keys in Frontend Environment Variables on Render.'
        }, { status: 500 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error('Auth check failed:', authError?.message || 'No user session found')
        return NextResponse.json({
            error: 'User Authentication Failed',
            details: authError?.message || 'Please log out and log back in to refresh your session.'
        }, { status: 401 })
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
