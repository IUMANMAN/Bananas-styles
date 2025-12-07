'use client'

import { useState, useCallback } from 'react'
import MasonryGrid from './MasonryGrid'
import StyleCard from './StyleCard'
import { fetchStyles } from '@/app/actions'
import { Loader2 } from 'lucide-react'

interface Style {
  id: string
  title: string
  generated_image_url: string
  original_image_url?: string
  introduction?: string
  prompt?: string
  created_at: string
  slug?: string
  user_id?: string
  source_url?: string
  ch_title?: string
  ch_prompt?: string
  ch_introduction?: string
}

interface InfiniteMasonryGridProps {
  initialStyles: Style[]
  initialLikedIds: string[]
  initialOpenedStyle?: Style | null
  currentUserId?: string
  isAdmin?: boolean
}

export default function InfiniteMasonryGrid({ initialStyles, initialLikedIds, initialOpenedStyle, currentUserId, isAdmin }: InfiniteMasonryGridProps) {
  const [styles, setStyles] = useState<Style[]>(() => {
    if (initialOpenedStyle && !initialStyles.find(s => s.id === initialOpenedStyle.id)) {
      return [initialOpenedStyle, ...initialStyles]
    }
    return initialStyles
  })
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set(initialLikedIds))
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)


  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await fetchStyles(nextPage)
      
      if (result.styles.length === 0) {
        setHasMore(false)
      } else {
        setStyles(prev => [...prev, ...result.styles])
        setLikedIds(prev => {
          const newSet = new Set(prev)
          result.likedIds.forEach(id => newSet.add(id))
          return newSet
        })
        setPage(nextPage)
        setHasMore(result.hasMore)
      }
    } catch (error) {
      console.error('Error loading more styles:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])



  return (
    <>
      <MasonryGrid>
        {styles.map((style) => (
          <StyleCard
            key={style.id}
            id={style.id}
            title={style.title}
            imageUrl={style.generated_image_url}
            originalImageUrl={style.original_image_url}
            introduction={style.introduction}
            prompt={style.prompt}
            initialLiked={likedIds.has(style.id)}
            initialOpenedStyleId={initialOpenedStyle?.id}
            slug={style.slug}
            ownerId={style.user_id}
            source_url={style.source_url}
            ch_title={style.ch_title}
            ch_prompt={style.ch_prompt}
            ch_introduction={style.ch_introduction}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        ))}
      </MasonryGrid>

      {/* Manual Load More Button */}
      <div className="flex flex-col items-center justify-center w-full mt-4 mb-8 gap-4">
        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-black dark:bg-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>Loading...</span>
                </>
             ) : (
                <span className="flex items-center gap-2">
                   Load More Styles
                </span>
             )}
          </button>
        ) : (
          styles.length > 0 && (
            <p className="text-gray-400 text-sm font-medium">
              You've reached the end of the collection
            </p>
          )
        )}
      </div>
    </>
  )
}
