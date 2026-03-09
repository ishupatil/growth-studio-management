import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
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
            error: 'Unauthorized',
            details: authError?.message || 'Please log out and log back in to refresh your session.'
        }, { status: 401 })
    }

    const { data: plans, error } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, plans })
}

export async function DELETE(request: Request) {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({
            error: 'Unauthorized',
            details: authError?.message || 'Please log out and log back in to refresh your session.'
        }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const { error } = await supabase
        .from('weekly_plans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
