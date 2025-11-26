'use client'

import { useState } from 'react'
import { addKeyword, deleteKeyword } from '@/app/admin/actions'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Keyword {
  id: string
  keyword: string
  created_at: string
}

interface KeywordManagerProps {
  initialKeywords: Keyword[]
}

export default function KeywordManager({ initialKeywords }: KeywordManagerProps) {
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords)
  const [newKeyword, setNewKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyword.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await addKeyword(newKeyword)
    
    if (result.success) {
      setSuccess('Keyword added successfully!')
      setNewKeyword('')
      // Refresh keywords list
      window.location.reload()
    } else {
      setError(result.error || 'Failed to add keyword')
    }
    
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this keyword?')) return

    const result = await deleteKeyword(id)
    
    if (result.success) {
      setKeywords(keywords.filter(k => k.id !== id))
      setSuccess('Keyword deleted successfully!')
    } else {
      setError(result.error || 'Failed to delete keyword')
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Add Keyword Form */}
      <form onSubmit={handleAdd} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter a new keyword..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newKeyword.trim()}
            className={cn(
              "px-6 py-2 bg-black text-white rounded-xl font-medium transition-all flex items-center gap-2",
              "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add
              </>
            )}
          </button>
        </div>
      </form>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg">
          {success}
        </div>
      )}

      {/* Keywords List */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold mb-4">
          Current Keywords ({keywords.length})
        </h2>
        
        {keywords.length === 0 ? (
          <p className="text-gray-400 text-sm">No keywords yet. Add one above!</p>
        ) : (
          <div className="space-y-2">
            {keywords.map((keyword) => (
              <div
                key={keyword.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
              >
                <span className="font-medium">{keyword.keyword}</span>
                <button
                  onClick={() => handleDelete(keyword.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
