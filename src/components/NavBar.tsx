import Link from 'next/link'
import AuthButton from './AuthButton'

import { createClient } from '@/lib/supabase/server'

export default async function NavBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'my0sterick@gmail.com'
  const isAdmin = user?.email === adminEmail

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:scale-105 transition-transform inline-block">
              Bananas
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {isAdmin && (
              <Link href="/admin/keywords" className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors px-2 py-1">
                Admin
              </Link>
            )}
            {user && (
              <Link href="/favorites" className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors px-2 py-1">
                My Likes
              </Link>
            )}
            <div className="ml-2">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
