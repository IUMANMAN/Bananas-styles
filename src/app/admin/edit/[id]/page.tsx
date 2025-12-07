'use client'

import { useState, useEffect, use } from 'react'
import { updateStyle, getStyle } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import KeywordSelector from '@/components/KeywordSelector'

// Helper: Compress Image to < 1MB
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        const MAX_DIM = 2000
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context failed'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        let quality = 0.9
        const attemptCompression = () => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Compression failed'))
              return
            }
            if (blob.size <= 1024 * 1024 || quality < 0.2) {
               resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }))
            } else {
               quality -= 0.1
               attemptCompression()
            }
          }, file.type, quality)
        }
        attemptCompression()
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

export default function EditStylePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [compressionStatus, setCompressionStatus] = useState('')
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [defaultValues, setDefaultValues] = useState<any>(null)

  useEffect(() => {
    getStyle(id).then(data => {
        if (!data) {
            setError('Style not found')
        } else {
            setDefaultValues(data)
            setGeneratedPreview(data.generated_image_url)
            setOriginalPreview(data.original_image_url)
        }
        setFetching(false)
    })
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (url: string | null) => void) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      // Don't reset preview if we have a file already and user just cancelled selection?
      // Actually standard behavior is to reset if file input is cleared.
      // But we might want to keep the old image if nothing new is selected.
      // The input value usually clears.
      // If we want to support "keeping existing image", we rely on the fact that form submission won't include a file if none selected.
      // But for preview... if they cancel, preview likely becomes null if we follow strict file input state.
      // Let's keep it simple: if file selected, show it.
    }
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setCompressionStatus('')
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', id)
    
    try {
      const generatedFile = formData.get('generated_image_file') as File
      if (generatedFile && generatedFile.size > 0 && generatedFile.size > 1024 * 1024) {
        setCompressionStatus('Compressing generated image...')
        const compressed = await compressImage(generatedFile)
        if (compressed.size > 1024 * 1024) {
           throw new Error(`Generated image too large.`)
        }
        formData.set('generated_image_file', compressed)
      }

      const originalFile = formData.get('original_image_file') as File
      if (originalFile && originalFile.size > 0 && originalFile.size > 1024 * 1024) {
        setCompressionStatus('Compressing original image...')
        const compressed = await compressImage(originalFile)
        if (compressed.size > 1024 * 1024) {
           throw new Error(`Original image too large.`)
        }
        formData.set('original_image_file', compressed)
      }

      setCompressionStatus('Updating...')
      const result = await updateStyle(formData)
      
      if (result.success) {
        router.push('/')
        router.refresh()
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setCompressionStatus('')
    }
  }

  if (fetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-900" /></div>
  if (error && !defaultValues) return <div className="text-center py-20 text-red-500">{error}</div>

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black text-[#330066] mb-8">Edit Style</h1>
      
      <form onSubmit={handleFormSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-lg border border-purple-50">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
          <input 
            name="title" 
            defaultValue={defaultValues.title}
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Introduction (Optional)</label>
          <textarea 
            name="introduction" 
            defaultValue={defaultValues.introduction}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Prompt</label>
          <textarea 
            name="prompt" 
            defaultValue={defaultValues.prompt}
            required 
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
          />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Source URL (Optional)</label>
          <input 
            name="source_url" 
            defaultValue={defaultValues.source_url}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
          />
        </div>

        {/* Keywords would need pre-population logic which KeywordSelector might not support yet easily. 
            Skipping keyword pre-population for now or just rendering empty selector. */}
        <KeywordSelector />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Generated Image</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#330066] transition-colors bg-gray-50 text-center h-48 overflow-hidden group">
               <input 
                type="file"
                name="generated_image_file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, setGeneratedPreview)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              {generatedPreview ? (
                <img 
                  src={generatedPreview} 
                  alt="Preview" 
                  className="absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-80"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-sm font-medium text-gray-500">Click to change (JPEG/PNG)</p>
                </div>
              )}
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Original Image (Optional)</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#330066] transition-colors bg-gray-50 text-center h-48 overflow-hidden group">
               <input 
                type="file"
                name="original_image_file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, setOriginalPreview)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
               {originalPreview ? (
                <img 
                  src={originalPreview} 
                  alt="Preview" 
                  className="absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-80"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-sm font-medium text-gray-500">Click to change (JPEG/PNG)</p>
                </div>
              )}
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
          {loading ? (compressionStatus || 'Updating...') : 'Update Style'}
        </button>
      </form>
    </div>
  )
}
