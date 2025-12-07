'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X } from 'lucide-react'

export interface Keyword {
  id: string
  keyword: string
}

export default function KeywordSelector() {
  const [input, setInput] = useState('')
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<Keyword[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    fetchKeywords()
  }, [])

  const fetchKeywords = async () => {
    const { data } = await supabase.from('keywords').select('*').order('keyword')
    if (data) setKeywords(data)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInput(val)
    if (val.trim()) {
      setSuggestions(keywords.filter(k => k.keyword.toLowerCase().includes(val.toLowerCase())))
    } else {
      setSuggestions([])
    }
  }

  const addKeyword = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      setSelectedKeywords([...selectedKeywords, keyword])
    }
    setInput('')
    setSuggestions([])
  }

  const removeKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter(k => k !== keyword))
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!input.trim()) return

      // Check if keyword exists
      const existing = keywords.find(k => k.keyword.toLowerCase() === input.toLowerCase())
      
      if (existing) {
        addKeyword(existing.keyword)
      } else {
        // Create new keyword? Maybe just allow adding text for now and let server handle creation?
        // Or create explicitly? For now, let's just add it to selected list as a "new" tag
        // Ideally we should create it on the fly or just pass text to server.
        // Let's pass text to server and let server handle 'find or create'.
        addKeyword(input.trim().toLowerCase())
      }
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700">Keywords</label>
      
      {/* Selected Keywords */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedKeywords.map(k => (
          <span key={k} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold flex items-center gap-1">
            {k}
            <button type="button" onClick={() => removeKeyword(k)} className="hover:text-purple-600">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Hidden Input for Form Submission */}
      <input type="hidden" name="keywords" value={JSON.stringify(selectedKeywords)} />

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type keyword and press Enter..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#330066] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => addKeyword(s.keyword)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium"
              >
                {s.keyword}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
