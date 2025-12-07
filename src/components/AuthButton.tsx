'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import AuthModal from './AuthModal'
import { LogIn } from 'lucide-react'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium hidden md:block">Hey, {user.email}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-5 py-2.5 text-sm font-bold text-white bg-neutral-900 hover:bg-black rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Login
      </button>

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
