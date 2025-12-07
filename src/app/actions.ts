'use server'

import { createClient } from '@/lib/supabase/server'

export async function fetchStyles(page: number, limit: number = 30) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const from = (page - 1) * limit
    const to = from + limit - 1

    // Fetch Styles
    const { data: styles, error } = await supabase
        .from('styles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error('Error fetching styles:', error)
        return { styles: [], likedIds: [], hasMore: false }
    }

    // Placeholder Likes if logged in
    let likedIds: string[] = []
    if (user && styles && styles.length > 0) {
        const styleIds = styles.map(s => s.id)
        const { data: likes } = await supabase
            .from('user_likes')
            .select('style_id')
            .eq('user_id', user.id)
            .in('style_id', styleIds)

        if (likes) {
            likedIds = likes.map(l => l.style_id)
        }
    }

    // Check if there are more items
    // We fetch one extra item or check count to determine hasMore, 
    // but simpler here is to check if we got full limit. 
    // Ideally we'd fetch limit + 1 to know for sure, but for now:
    const hasMore = styles.length === limit

    return {
        styles,
        likedIds,
        hasMore
    }
}
