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

// ... imports
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

async function uploadToR2(file: File, folder: string): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()
    const key = `${folder}/${uuidv4()}.${ext}`

    await r2.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    }))

    return `${R2_PUBLIC_URL}/${key}`
}

export async function createStyle(formData: FormData) {
    const admin = await isAdmin()
    if (!admin) {
        return { success: false, error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const introduction = formData.get('introduction') as string
    const prompt = formData.get('prompt') as string
    const source_url = formData.get('source_url') as string

    // File handling
    const generatedImageFile = formData.get('generated_image_file') as File
    const originalImageFile = formData.get('original_image_file') as File

    let generated_image_url = formData.get('generated_image_url') as string
    let original_image_url = formData.get('original_image_url') as string

    // Upload logic
    try {
        if (generatedImageFile && generatedImageFile.size > 0) {
            generated_image_url = await uploadToR2(generatedImageFile, 'generated')
        }
        if (originalImageFile && originalImageFile.size > 0) {
            original_image_url = await uploadToR2(originalImageFile, 'originals')
        }
    } catch (error) {
        console.error('Upload error:', error)
        return { success: false, error: 'Failed to upload images' }
    }

    if (!title || !prompt || !generated_image_url) {
        return { success: false, error: 'Missing required fields (Title, Prompt, Generated Image)' }
    }

    const supabase = await createClient()
    // Generate slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Remove duplicate hyphens
        .trim()

    const { data: style, error } = await supabase
        .from('styles')
        .insert({
            title,
            introduction,
            prompt,
            source_url: source_url || null,
            generated_image_url,
            original_image_url: original_image_url || null,
            slug,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating style:', error)
        return { success: false, error: error.message }
    }

    // Handle Keywords
    const keywordsJson = formData.get('keywords') as string
    if (keywordsJson) {
        try {
            const keywords = JSON.parse(keywordsJson) as string[]
            if (keywords.length > 0) {
                // Determine user ID (we know user exists from update above, but need id)
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    for (const k of keywords) {
                        const keywordText = k.trim().toLowerCase()
                        if (!keywordText) continue

                        // 1. Find or Create Keyword
                        let keywordId: string | null = null

                        const { data: existing } = await supabase
                            .from('keywords')
                            .select('id')
                            .eq('keyword', keywordText)
                            .single()

                        if (existing) {
                            keywordId = existing.id
                        } else {
                            const { data: newKeyword } = await supabase
                                .from('keywords')
                                .insert({ keyword: keywordText, created_by: user.id })
                                .select('id')
                                .single()
                            if (newKeyword) keywordId = newKeyword.id
                        }

                        // 2. Link to Style
                        if (keywordId) {
                            await supabase
                                .from('style_keywords')
                                .insert({ style_id: style.id, keyword_id: keywordId })
                                .ignore() // ignore duplicates
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error processing keywords:', e)
        }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deleteKeyword(id: string) {
    // ... existing deleteKeyword code
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
