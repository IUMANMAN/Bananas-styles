'use server'

import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getAllKeywords() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching keywords:', error)
        return []
    }

    return data || []
}

export async function addKeyword(keyword: string) {
    const admin = await isAdmin()
    if (!admin) {
        return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Check if keyword already exists
    const { data: existing } = await supabase
        .from('keywords')
        .select('id')
        .eq('keyword', keyword.toLowerCase().trim())
        .single()

    if (existing) {
        return { success: false, error: 'Keyword already exists' }
    }

    // Insert new keyword
    const { error } = await supabase
        .from('keywords')
        .insert({
            keyword: keyword.toLowerCase().trim(),
            created_by: user.id
        })

    if (error) {
        console.error('Error adding keyword:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/keywords')
    return { success: true }
}

export async function deleteKeyword(id: string) {
    const admin = await isAdmin()
    if (!admin) {
        return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting keyword:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/keywords')
    return { success: true }
}
