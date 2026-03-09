import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
            error: 'Unauthorized',
            details: authError?.message || 'Please log out and log back in to refresh your session.'
        }, { status: 401 })
    }

    const body = await request.json()
    let backendUrl = (process.env.CREWAI_BACKEND_URL || '').trim()
    const secret = (process.env.CREWAI_API_SECRET || '').trim()

    // Robust URL normalization
    if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1)
    if (backendUrl.endsWith('/generate-plan')) backendUrl = backendUrl.slice(0, -14)

    try {
        if (!backendUrl) {
            throw new Error('CREWAI_BACKEND_URL is missing in Render environment variables.')
        }
        if (!secret) {
            console.warn('Warning: CREWAI_API_SECRET is not set. Requests may be rejected by backend.')
        }

        // Call Flask + CrewAI backend on Render.com
        const response = await fetch(`${backendUrl}/generate-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Secret': secret || '',
            },
            body: JSON.stringify(body),
            // Long timeout — CrewAI takes time (Increased to 5 mins for Render free tier)
            signal: AbortSignal.timeout(300000),
        })

        const contentType = response.headers.get('content-type')
        if (!response.ok) {
            let errorMessage = `Backend error (${response.status})`

            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json()
                errorMessage = errorData.error || errorMessage

                if (response.status === 401) {
                    errorMessage = `Backend rejected request: ${errorMessage}. Please check that CREWAI_API_SECRET on Frontend matches API_SECRET_KEY on Backend in Render.`
                }
            } else {
                const text = await response.text()
                const snippet = text.substring(0, 150)
                console.error(`Backend non-JSON response (${response.status}):`, snippet)
                errorMessage = `Backend returned non-JSON error (${response.status}). Details: ${snippet}...`
            }
            throw new Error(errorMessage)
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
