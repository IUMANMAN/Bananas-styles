'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const ADMIN_EMAILS = ['my0sterick@gmail.com'] // Consistent with other admin checks

async function isAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user && user.email && ADMIN_EMAILS.includes(user.email)
}

export async function fetchGuides() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('publish_date', { ascending: false })

    if (error) {
        console.error('Error fetching guides:', error)
        return []
    }
    return data
}

export async function createGuide(formData: FormData) {
    if (!await isAdmin()) return { success: false, error: 'Unauthorized' }

    // Use Admin Client to bypass RLS for write
    const supabase = createAdminClient()

    const guide = {
        title: formData.get('title') as string,
        introduction: formData.get('introduction') as string,
        url: formData.get('url') as string,
        author: formData.get('author') as string,
        publish_date: formData.get('publish_date') as string || new Date().toISOString(),
        ch_title: formData.get('ch_title') as string,
        ch_introduction: formData.get('ch_introduction') as string,
    }

    const { error } = await supabase.from('guides').insert(guide)

    if (error) return { success: false, error: error.message }

    revalidatePath('/guides')
    return { success: true }
}

export async function updateGuide(id: string, formData: FormData) {
    if (!await isAdmin()) return { success: false, error: 'Unauthorized' }

    // Use Admin Client to bypass RLS for write
    const supabase = createAdminClient()

    const updates = {
        title: formData.get('title') as string,
        introduction: formData.get('introduction') as string,
        url: formData.get('url') as string,
        author: formData.get('author') as string,
        publish_date: formData.get('publish_date') as string,
        ch_title: formData.get('ch_title') as string,
        ch_introduction: formData.get('ch_introduction') as string,
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('guides')
        .update(updates)
        .eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/guides')
    return { success: true }
}

export async function deleteGuide(id: string) {
    if (!await isAdmin()) return { success: false, error: 'Unauthorized' }

    // Use Admin Client to bypass RLS for write
    const supabase = createAdminClient()
    const { error } = await supabase.from('guides').delete().eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/guides')
    return { success: true }
}
