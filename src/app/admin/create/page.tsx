'use client'

import { useState } from 'react'
import { createStyle } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import KeywordSelector from '@/components/KeywordSelector'

export default function CreateStylePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    const result = await createStyle(formData)
    
    if (result.success) {
      router.push('/')
      router.refresh()
    } else {
      setError(result.error || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black text-[#330066] mb-8">Create New Style</h1>
      
      <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-lg border border-purple-50">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
          <input 
            name="title" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            placeholder="e.g. Neon Cyberpunk Banana"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Introduction (Optional)</label>
          <textarea 
            name="introduction" 
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            placeholder="Brief description..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Prompt</label>
          <textarea 
            name="prompt" 
            required 
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            placeholder="The AI prompt used..."
          />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Source URL (Optional)</label>
          <input 
            name="source_url" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            placeholder="https://..."
          />
        </div>

        <KeywordSelector />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Generated Image</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#330066] transition-colors bg-gray-50 text-center">
               <input 
                type="file"
                name="generated_image_file"
                accept=".jpg,.jpeg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none">
                <p className="text-sm font-medium text-gray-500">Click to upload (JPEG/PNG)</p>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Original Image (Optional)</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#330066] transition-colors bg-gray-50 text-center">
               <input 
                type="file"
                name="original_image_file"
                accept=".jpg,.jpeg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
               <div className="pointer-events-none">
                <p className="text-sm font-medium text-gray-500">Click to upload (JPEG/PNG)</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-[#330066] hover:bg-[#4a0080] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? 'Creating...' : 'Create Style'}
        </button>
      </form>
    </div>
  )
}
