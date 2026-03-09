export interface GrowthFormData {
    username: string
    followers: number
    avg_likes: number
    avg_comments: number
    posting_frequency: number
    content_type: string
    brand_tone: string
    goal: string
    target_followers: number
}

export interface GeneratedPlan {
    audit_report: string
    growth_strategy: string
    content_calendar: string
    captions_hashtags: string
    extra_tips: string
}

export interface WeeklyPlan {
    id: string
    user_id: string
    profile_id: string
    instagram_username: string
    audit_report: string
    growth_strategy: string
    content_calendar: string
    captions_hashtags: string
    extra_tips: string
    created_at: string
}
