import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    let backendUrl = process.env.CREWAI_BACKEND_URL || ''
    const secret = process.env.CREWAI_API_SECRET

    // Normalize URL: remove trailing slash if exists
    if (backendUrl.endsWith('/')) {
        backendUrl = backendUrl.slice(0, -1)
    }

    try {
        if (!backendUrl || backendUrl === 'http://localhost' || backendUrl.includes('localhost')) {
            throw new Error('CREWAI_BACKEND_URL is not configured correctly in Render environment variables.')
        }

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

        const contentType = response.headers.get('content-type')
        if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json()
                throw new Error(error.error || 'Backend error')
            } else {
                throw new Error(`Backend returned non-JSON error (${response.status}). Please check your Render logs for the backend service.`)
            }
        }

        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Backend returned invalid response (Expected JSON, got HTML). This usually means the CREWAI_BACKEND_URL is incorrect.')
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
