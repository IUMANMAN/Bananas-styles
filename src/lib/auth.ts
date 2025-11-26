'use server'

import { createClient } from '@/lib/supabase/server'

export async function isAdmin(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'my0sterick@gmail.com'
    return user.email === adminEmail
}
