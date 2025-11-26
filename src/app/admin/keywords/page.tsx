import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getAllKeywords } from '../actions'
import KeywordManager from '@/components/KeywordManager'

export default async function AdminKeywordsPage() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/')
  }

  const keywords = await getAllKeywords()

  return (
    <div className="min-h-screen pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-2">
          Keyword Management
        </h1>
        <p className="text-gray-500">
          Add and manage keywords that will be highlighted in all prompts.
        </p>
      </div>

      <KeywordManager initialKeywords={keywords} />
    </div>
  )
}
