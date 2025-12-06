'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, Share2, Check } from 'lucide-react'
import StyleModal from './StyleModal'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Style {
  id: string
  title: string
  introduction?: string
  prompt: string
  generated_image_url: string
  original_image_url?: string
  source_url?: string
  is_liked?: boolean
}

interface StyleCardProps {
  id: string
  title: string
  imageUrl: string
  originalImageUrl?: string
  introduction?: string
  prompt?: string
  initialLiked?: boolean
}

export default function StyleCard({ id, title, imageUrl, originalImageUrl, introduction, prompt, initialLiked = false }: StyleCardProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()

  // Remove leading numbering (e.g., "1. ", "12. ")
  const displayTitle = title.replace(/^\d+\.\s*/, '')

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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/style/${id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  return (
    <>
      <div 
        className="group relative mb-8 break-inside-avoid rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <div 
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer"
        >
          <div className="flex w-full">
             {/* Generated Image (Left side if original exists, otherwise full) */}
            <div className={cn(
              "relative aspect-[3/4] overflow-hidden bg-gray-100",
              originalImageUrl ? "w-1/2 border-r border-white/20" : "w-full"
            )}>
              <Image
                src={imageUrl}
                alt={displayTitle}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                AI
              </div>
            </div>

            {/* Original Image (Right side) */}
            {originalImageUrl && (
              <div className="relative w-1/2 aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={originalImageUrl}
                  alt={`Original - ${displayTitle}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                 <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                  Ref
                </div>
              </div>
            )}
          </div>
          
          {/* Card Footer: Title and Actions - Clean White Background */}
          <div className="bg-white dark:bg-zinc-900 p-4 flex justify-between items-center gap-3">
             <h3 className="font-bold text-black dark:text-gray-200 text-sm sm:text-base leading-tight line-clamp-2 flex-grow">
              {displayTitle}
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-[#330066] hover:bg-gray-50 transition-all duration-200"
                title="Share Link"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleLike}
                className={cn(
                  "flex-shrink-0 p-2 rounded-full transition-all duration-200",
                  liked 
                    ? "text-red-500 bg-red-50" 
                    : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                )}
              >
                <Heart className={cn("w-5 h-5", liked && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <StyleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        style={{
          title: displayTitle,
          introduction,
          prompt: prompt || '',
          imageUrl,
          originalImageUrl
        }}
      />
    </>
  )
}
