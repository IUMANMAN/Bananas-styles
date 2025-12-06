'use client'

import { X, Copy, Check } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import HighlightedText from './HighlightedText'
import { createClient } from '@/lib/supabase/client'

interface StyleModalProps {
  isOpen: boolean
  onClose: () => void
  style: {
    title: string
    introduction?: string
    prompt: string
    imageUrl: string
    originalImageUrl?: string
  }
}

export default function StyleModal({ isOpen, onClose, style }: StyleModalProps) {
  const [copied, setCopied] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])

  // Fetch keywords
  useEffect(() => {
    const fetchKeywords = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('keywords')
        .select('keyword')
      
      if (data) {
        setKeywords(data.map(k => k.keyword))
      }
    }
    
    if (isOpen) {
      fetchKeywords()
    }
  }, [isOpen])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(style.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content - Single Scroll Container on Mobile */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-black sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full sm:h-auto sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Unified Scroll Container for Mobile - Split for Desktop */}
         <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
        
          {/* Images Section (Left/Top) */}
          <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-900 flex flex-col shrink-0 md:h-full md:overflow-y-auto">
            {/* Generated Image */}
            <div className="relative w-full min-h-[300px] md:min-h-0 md:flex-1 aspect-[3/4] md:aspect-auto">
               <Image
                src={style.imageUrl}
                alt={`Generated - ${style.title}`}
                fill
                className="object-contain md:object-cover bg-gray-900"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-xs font-semibold text-white uppercase tracking-wider shadow-sm z-20">
                Generated
              </div>
            </div>
            
            {/* Original Image */}
            {style.originalImageUrl && (
              <div className="relative w-full min-h-[300px] md:min-h-0 md:flex-1 border-t-4 border-white dark:border-gray-800 aspect-[3/4] md:aspect-auto">
                <Image
                  src={style.originalImageUrl}
                  alt={`Original - ${style.title}`}
                  fill
                  className="object-contain md:object-cover bg-gray-900"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-blue-600/80 backdrop-blur-md rounded-lg text-xs font-semibold text-white uppercase tracking-wider shadow-sm z-20">
                  Original
                </div>
              </div>
            )}
          </div>

          {/* Details Section (Right/Bottom) */}
          <div className="w-full md:w-1/2 flex flex-col bg-white dark:bg-black md:h-full md:overflow-hidden">
            <div className="p-6 md:p-8 md:overflow-y-auto flex-1 pb-24 md:pb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-purple-300 mb-4">
                {style.title}
              </h2>
              
              {style.introduction && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {style.introduction}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Prompt
                  </h3>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    copied 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <p className="text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                  <HighlightedText text={style.prompt} keywords={keywords} />
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer Actions (Fixed at bottom on mobile) */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50 md:relative fixed bottom-0 left-0 right-0 z-20">
            <button 
              onClick={onClose}
              className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.98] duration-200"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
