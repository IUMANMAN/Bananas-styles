'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye } from 'lucide-react'
import StyleModal from './StyleModal'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

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
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()

  // Remove leading numbering (e.g., "1. ", "12. ")
  const displayTitle = title.replace(/^\d+\.\s*/, '')

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Prompt login or handle unauthenticated state
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

  return (
    <>
      <div 
        className="group relative mb-6 break-inside-avoid rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
        >
          {/* Generated Image (Default) */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-in-out",
            isHovered && originalImageUrl ? "opacity-0" : "opacity-100"
          )}>
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[10px] font-medium text-white uppercase tracking-wider">
              Generated
            </div>
          </div>

          {/* Original Image (Hover) */}
          {originalImageUrl && (
            <div className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-in-out",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Image
                src={originalImageUrl}
                alt={`Original - ${displayTitle}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500/80 backdrop-blur-sm rounded text-[10px] font-medium text-white uppercase tracking-wider">
                Original
              </div>
            </div>
          )}

          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )} />
          
          {/* View Details Overlay Button */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </div>
          </div>
        </div>
          
        <button
          onClick={toggleLike}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 transform z-10",
            liked ? "bg-red-500 text-white" : "bg-white/30 text-white hover:bg-white/50",
            isHovered || liked ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          )}
        >
          <Heart className={cn("w-5 h-5", liked && "fill-current")} />
        </button>
        
        <div 
          onClick={() => setIsModalOpen(true)}
          className="p-4 cursor-pointer"
        >
          <h3 className="font-medium text-gray-900 truncate">{displayTitle}</h3>
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
