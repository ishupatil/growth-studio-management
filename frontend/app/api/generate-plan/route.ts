import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const backendUrl = process.env.CREWAI_BACKEND_URL
    const secret = process.env.CREWAI_API_SECRET

    try {
        // Call Flask + CrewAI backend on Render.com
        const response = await fetch(`${backendUrl}/generate-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Secret': secret || '',
            },
            body: JSON.stringify(body),
            // Long timeout — CrewAI takes time
            signal: AbortSignal.timeout(180000), // 3 minutes
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Backend error')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Generation failed')
        }

        return NextResponse.json({
            success: true,
            data: result.data,
        })

    } catch (error: any) {
        if (error.name === 'TimeoutError') {
            return NextResponse.json(
                { error: 'AI generation timed out. Please try again.' },
                { status: 504 }
            )
        }
        return NextResponse.json(
            { error: error.message || 'Generation failed' },
            { status: 500 }
        )
    }
}
