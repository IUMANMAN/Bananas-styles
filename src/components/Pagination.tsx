import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-center gap-4 mt-12 mb-8">
      <Link
        href={hasPrevious ? `${baseUrl}?page=${currentPage - 1}` : '#'}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
          hasPrevious 
            ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300" 
            : "bg-gray-50 border-transparent text-gray-300 cursor-not-allowed pointer-events-none"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </Link>

      <div className="text-sm font-medium text-gray-500">
        Page {currentPage} of {totalPages}
      </div>

      <Link
        href={hasNext ? `${baseUrl}?page=${currentPage + 1}` : '#'}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
          hasNext 
            ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300" 
            : "bg-gray-50 border-transparent text-gray-300 cursor-not-allowed pointer-events-none"
        )}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
