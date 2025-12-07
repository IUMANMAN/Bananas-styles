'use client'

import { createPortal } from 'react-dom'
import { X, Copy, Check } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import HighlightedText from './HighlightedText'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'

interface StyleModalProps {
  isOpen: boolean
  onClose: () => void
  style: {
    title: string
    introduction?: string
    prompt: string
    imageUrl: string
    originalImageUrl?: string
    source_url?: string
  }
}

export default function StyleModal({ isOpen, onClose, style }: StyleModalProps) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // ... fetchKeywords effect

  // Scroll lock effect
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(style.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
      {/* Backdrop - Glass Effect */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-white dark:bg-black sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[100dvh] sm:h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Unified Scroll Container for Mobile - Split for Desktop */}
        {/* Unified Scroll Container (Mobile: Vertical flow, Desktop: row) */}
         <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
        
          {/* Images Section (Left/Top) */}
          {/* Images Section (Left/Top) */}
          <div className="w-full md:w-3/5 bg-black flex flex-row flex-nowrap h-[35vh] md:h-full shrink-0">
            {/* Original Image */}
            {style.originalImageUrl && (
              <div className="relative w-1/2 basis-1/2 h-full flex items-center justify-center p-2 md:p-4 border-r border-white/10 shrink-0">
                <img
                  src={style.originalImageUrl}
                  alt={`Original - ${style.title}`}
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute top-2 left-2 md:top-4 md:left-4 px-2 py-1 md:px-3 md:py-1.5 bg-blue-600/80 backdrop-blur-md rounded-lg text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider shadow-sm z-20">
                  Original
                </div>
              </div>
            )}

            {/* Generated Image */}
            <div className={cn(
              "relative flex items-center justify-center p-2 md:p-4 shrink-0",
              style.originalImageUrl 
                ? "w-1/2 basis-1/2 h-full" 
                : "w-full h-full"
            )}>
               <img
                src={style.imageUrl}
                alt={`Generated - ${style.title}`}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-2 right-2 md:top-4 md:right-4 px-2 py-1 md:px-3 md:py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider shadow-sm z-20">
                Generated
              </div>
            </div>
          </div>

          {/* Details Section (Right/Bottom) */}
          <div className="w-full md:w-2/5 flex flex-col bg-white dark:bg-black md:h-full md:overflow-hidden">
            <div className="p-6 md:p-8 md:overflow-y-auto flex-1 pb-24 md:pb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {style.title}
              </h2>
              
              {style.introduction && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('Description', '描述')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {style.introduction}
                  </p>
                </div>
              )}

              {style.source_url && (
                <div className="mb-8">
                   <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('Author', '作者')}
                  </h3>
                  {(() => {
                    // Try to parse Markdown link [Text](URL)
                    const markdownMatch = style.source_url.match(/\[(.*?)\]\((.*?)\)/);
                    if (markdownMatch) {
                      const [, text, url] = markdownMatch;
                      return (
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#330066] dark:text-purple-300 hover:underline font-medium text-lg"
                        >
                          {text}
                        </a>
                      );
                    }
                    // Fallback to plain URL or text
                    const isUrl = style.source_url.startsWith('http');
                    return isUrl ? (
                      <a 
                        href={style.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#330066] dark:text-purple-300 hover:underline font-medium break-all"
                      >
                        {style.source_url}
                      </a>
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {style.source_url}
                      </span>
                    );
                  })()}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {t('Prompt', '提示词')}
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
                      {t('Copied', '已复制')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      {t('Copy', '复制')}
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
              {t('Close Details', '关闭详情')}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>,
    document.body
  )
}
