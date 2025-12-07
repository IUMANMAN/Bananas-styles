'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
}

interface InfiniteMasonryGridProps {
  initialStyles: Style[]
  initialLikedIds: string[]
  initialOpenedStyle?: Style | null
}

export default function InfiniteMasonryGrid({ initialStyles, initialLikedIds, initialOpenedStyle }: InfiniteMasonryGridProps) {
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
  const observerTarget = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

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
          />
        ))}
      </MasonryGrid>

      {/* Loading Indicator / Trigger */}
      <div ref={observerTarget} className="h-8 flex items-center justify-center w-full mt-4">
        {loading && <Loader2 className="w-8 h-8 animate-spin text-gray-400" />}
        {!hasMore && styles.length > 0 && (
          <p className="text-gray-400 text-sm">You've reached the end</p>
        )}
      </div>
    </>
  )
}
