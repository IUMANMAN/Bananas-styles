'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    
    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto mt-8">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search prompts (e.g., 'anime', 'portrait')..."
            className="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none shadow-sm transition-all"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <button 
            type="submit"
            disabled={isPending}
            className="absolute right-2.5 bottom-2.5 bg-black text-white hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </form>
  )
}
