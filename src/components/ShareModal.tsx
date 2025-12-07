import { createPortal } from 'react-dom'
import { X, Copy, Check, Twitter, Facebook, Link as LinkIcon, Download } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { toPng } from 'html-to-image'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  style: {
    id: string
    slug?: string
    title: string
    prompt: string
    imageUrl: string
    originalImageUrl?: string
  }
}

export default function ShareModal({ isOpen, onClose, style }: ShareModalProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  // Initialize with proxied URLs to ensure immediate render attempt if preload takes time? 
  // No, safer to wait or show spinner? Let's try direct proxy url as fallback
  const [imgSources, setImgSources] = useState({ generated: '', original: '' })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Preload images via Proxy
  useEffect(() => {
    if (!isOpen) return

    let isActive = true
    const loadImages = async () => {
      try {
        const load = async (targetUrl?: string) => {
          if (!targetUrl) return ''
          // Use our local proxy to fetch the image
          const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(targetUrl)}`
          try {
            const res = await fetch(proxyUrl)
            if (!res.ok) throw new Error('Proxy failed')
            const blob = await res.blob()
            return URL.createObjectURL(blob)
          } catch (e) {
            console.warn('Failed to load image via proxy:', targetUrl, e)
            return targetUrl // Fallback
          }
        }

        const [gen, orig] = await Promise.all([
          load(style.imageUrl),
          load(style.originalImageUrl)
        ])

        if (isActive) {
          setImgSources({ generated: gen || '', original: orig || '' })
        }
      } catch (e) {
        console.error('Error preload images', e)
      }
    }

    loadImages()

    return () => {
      isActive = false
    }
  }, [isOpen, style.imageUrl, style.originalImageUrl])

  if (!isOpen || !mounted) return null
  
  // Use production domain for sharing
  const shareDomain = process.env.NEXT_PUBLIC_APP_URL || 'https://pumpbanana.com'
  const shareUrl = `${shareDomain}/style/${style.slug || style.id}`
  const shareText = `Check out this prompt "${style.title}" on PUMPBANANA! `

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsDownloading(true)
    try {
      // Small delay to ensure rendering is stable
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const dataUrl = await toPng(cardRef.current, { 
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: true,
      })
      
      const link = document.createElement('a')
      link.download = `pumpbanana-${style.title.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to download', err)
      alert('Failed to generate image. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-black text-white hover:bg-gray-800'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877F2] text-white hover:bg-[#166fe5]'
    }
  ]

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop - Increased opacity */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* LEFT: Preview Area */}
        <div className="flex-1 bg-gray-100 dark:bg-black/50 p-6 md:p-10 flex items-center justify-center overflow-y-auto min-h-[300px]">
          {/* Card to Capture */}
          <div ref={cardRef} className="bg-white p-5 rounded-[2rem] shadow-xl max-w-sm w-full flex flex-col gap-4">
             <div className="flex rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 aspect-video">
                {style.originalImageUrl && (
                  <div className="w-1/2 relative border-r border-white/20">
                    <img 
                      src={imgSources.original || `/api/image-proxy?url=${encodeURIComponent(style.originalImageUrl)}`}
                      alt="Original" 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                      Ref
                    </div>
                  </div>
                )}
                <div className={cn("relative", style.originalImageUrl ? "w-1/2" : "w-full")}>
                  <img 
                    src={imgSources.generated || `/api/image-proxy?url=${encodeURIComponent(style.imageUrl)}`}
                    alt="Generated" 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                    AI
                  </div>
                </div>
             </div>
             
             <div className="space-y-3 px-1 flex-1">
               <h4 className="font-bold text-xl text-gray-900 leading-tight">
                 {style.title}
               </h4>
               <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 text-xs font-mono leading-relaxed line-clamp-6">
                 {style.prompt}
               </div>
             </div>

             {/* Footer with Logo */}
             <div className="pt-2 mt-auto border-t border-gray-100 flex items-center gap-3">
                <img 
                  src="/banana-logo.jpeg" 
                  alt="PumpBanana" 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                  crossOrigin="anonymous"
                />
                <div className="flex flex-col">
                  <span className="text-[12px] font-black uppercase tracking-widest text-gray-900">PumpBanana</span>
                  <span className="text-[10px] text-gray-400 font-medium">pumpbanana.com</span>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT: Controls & Details */}
        <div className="w-full md:w-[400px] bg-white dark:bg-zinc-900 border-l border-gray-100 dark:border-gray-800 flex flex-col">
           {/* Header */}
           <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-zinc-900 shrink-0">
             <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Share & Download</h3>
             <button 
               onClick={onClose}
               className="p-2 -mr-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
             >
               <X className="w-6 h-6" />
             </button>
           </div>
           
           <div className="p-6 space-y-8 overflow-y-auto flex-1">
             
             {/* Link Section */}
             <div className="space-y-3">
               <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Style Link</label>
               <div className="flex gap-2">
                 <div className="flex-1 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
                   {shareUrl}
                 </div>
                 <button
                   onClick={handleCopyLink}
                   className="p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-opacity shrink-0"
                   title="Copy Link"
                 >
                   {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                 </button>
               </div>
             </div>

             <div className="space-y-3">
               <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Download</label>
               <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/20 rounded-xl font-bold hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
               >
                  <Download className={cn("w-5 h-5", isDownloading && "animate-bounce")} />
                  {isDownloading ? 'Generating Image...' : 'Download Card Image'}
               </button>
               <p className="text-center text-xs text-gray-400">
                 Saves a high-quality PNG of the style card
               </p>
             </div>

             <div className="space-y-3">
               <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Share to Social</label>
               <div className="grid grid-cols-2 gap-3">
                 {socialLinks.map((social) => (
                   <a
                     key={social.name}
                     href={social.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={cn(
                       "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-transform hover:scale-105",
                       social.color
                     )}
                   >
                     <social.icon className="w-5 h-5" />
                     {social.name}
                   </a>
                 ))}
               </div>
             </div>

           </div>
        </div>

      </div>
    </div>,
    document.body
  )
}
