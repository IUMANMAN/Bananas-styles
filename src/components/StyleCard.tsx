'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, Share2, Check, Copy, Trash2, Pencil } from 'lucide-react'
import StyleModal from './StyleModal'
import ShareModal from './ShareModal'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { deleteStyle } from '@/app/admin/actions'
import { useLanguage } from '@/contexts/LanguageContext'

interface Style {
  id: string
  title: string
  introduction?: string
  prompt: string
  generated_image_url: string
  original_image_url?: string
  source_url?: string
  is_liked?: boolean
  slug?: string
  user_id?: string
}

interface StyleCardProps {
  id: string
  title: string
  imageUrl: string
  originalImageUrl?: string
  introduction?: string
  prompt?: string
  initialLiked?: boolean
  initialOpenedStyleId?: string
  slug?: string
  source_url?: string
  ch_title?: string
  ch_prompt?: string
  ch_introduction?: string
  ownerId?: string
  currentUserId?: string
  isAdmin?: boolean
}

export default function StyleCard({ 
  id, 
  title, 
  imageUrl, 
  originalImageUrl, 
  introduction, 
  prompt, 
  initialLiked = false, 
  initialOpenedStyleId, 
  slug,
  source_url,
  ch_title,
  ch_prompt,
  ch_introduction,
  ownerId,
  currentUserId,
  isAdmin
}: StyleCardProps) {
  const { t } = useLanguage()
  const currentTitle = t(title, ch_title)
  // Clean title numbering if strictly needed, but English/Chinese titles might differ in format.
  // The original cleaner `title.replace(/^\d+\.\s*/, '')` handles "18. Title".
  // Localized titles might not have numbering or might have it. Let's apply cleaning.
  const displayTitle = currentTitle?.replace(/^\d+\.\s*/, '') || ''

  const displayPrompt = t(prompt, ch_prompt) || ''
  const displayIntroduction = t(introduction, ch_introduction)
  
  const [liked, setLiked] = useState(initialLiked)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  
  // Use slug if available, fallback to ID
  const shareId = slug || id

  const canDelete = isAdmin || (currentUserId && ownerId && currentUserId === ownerId)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this style? This cannot be undone.')) return

    setIsDeleting(true)
    const result = await deleteStyle(id)
    
    if (result.success) {
      router.refresh()
    } else {
      alert('Failed to delete: ' + result.error)
      setIsDeleting(false)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    window.history.pushState({ modalOpen: true }, '', `/style/${shareId}`)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    window.history.pushState(null, '', '/')
  }

  useEffect(() => {
    if (initialOpenedStyleId && id === initialOpenedStyleId) {
      setIsModalOpen(true)
      window.history.replaceState({ modalOpen: true }, '', `/style/${shareId}`)
    }
  }, [id, initialOpenedStyleId, shareId])

  // Remove leading numbering
  // const displayTitle = title.replace(/^\d+\.\s*/, '')

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please login to save styles')
      return
    }

    const newLikedState = !liked
    setLiked(newLikedState)

    if (newLikedState) {
      await supabase.from('user_likes').insert({ user_id: user.id, style_id: id })
    } else {
      await supabase.from('user_likes').delete().match({ user_id: user.id, style_id: id })
    }
  }

  const [copied, setCopied] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(displayPrompt || '')
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  const handleShare = async (e: React.MouseEvent) => {
    // ... existing share logic
  }

  return (
    <>
      <div 
        className={cn(
          "group relative mb-8 break-inside-avoid rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300",
          isDeleting && "opacity-50 pointer-events-none"
        )}
      >
        <div 
          onClick={handleOpenModal}
          className="cursor-pointer"
        >
          {/* ... Images ... */}
          <div className="flex w-full">
            {originalImageUrl && (
              <div className="relative w-1/2 overflow-hidden bg-gray-100 border-r border-white/20">
                <img
                  src={originalImageUrl}
                  alt={`Original - ${displayTitle}`}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                 <div className="absolute top-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                  Ref
                </div>
              </div>
            )}

            <div className={cn(
              "relative overflow-hidden bg-gray-100",
              originalImageUrl ? "w-1/2" : "w-full"
            )}>
              <img
                src={imageUrl}
                alt={displayTitle}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                AI
              </div>
            </div>
          </div>
          
          {/* Card Footer */}
          <div className="bg-zinc-100/80 dark:bg-zinc-900 p-4 flex justify-between items-center gap-3 backdrop-blur-sm">
             <h3 className="font-bold text-black dark:text-gray-200 text-sm sm:text-base leading-tight line-clamp-2 flex-grow">
              {displayTitle}
            </h3>
            
            <div className="flex items-center gap-2">
              {canDelete && (
                <>
                  <Link
                    href={`/admin/edit/${id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    title="Edit Style"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    title="Delete Style"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                onClick={handleCopyPrompt}
                className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200 group/tooltip relative"
                title="Copy Prompt"
              >
               {promptCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setIsShareModalOpen(true)
                }}
                className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-[#330066] hover:bg-gray-50 transition-all duration-200"
                title="Share this Style"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={toggleLike}
                className={cn(
                  "flex-shrink-0 p-2 rounded-full transition-all duration-200",
                  liked 
                    ? "text-red-500 bg-red-50" 
                    : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                )}
                title={liked ? "Unlike" : "Like & Collect"}
              >
                <Heart className={cn("w-5 h-5", liked && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <StyleModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        style={{
          title: displayTitle,
          introduction: displayIntroduction,
          prompt: displayPrompt,
          imageUrl,
          originalImageUrl,
          source_url
        }}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        style={{
          id,
          slug: shareId,
          title: displayTitle,
          prompt: displayPrompt,
          imageUrl,
          originalImageUrl
        }}
      />
    </>
  )
}
