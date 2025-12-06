import Link from 'next/link'
import AuthButton from './AuthButton'

import { createClient } from '@/lib/supabase/server'

export default async function NavBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'my0sterick@gmail.com'
  const isAdmin = user?.email === adminEmail

  return (
    <nav className="absolute top-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20 relative">
          
          {/* Centered Logo & Title */}
          <Link href="/" className="flex flex-col items-center group">
            <div className="relative w-10 h-10 mb-1 transition-transform group-hover:scale-110 duration-300">
               <img src="/banana-logo.png" alt="Banana Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black text-[#330066] dark:text-purple-300 uppercase tracking-tighter">
              Bananas
            </span>
          </Link>

          {/* Right-aligned Navigation Items (Absolute to keep title centered) */}
          <div className="absolute right-0 flex items-center gap-4 sm:gap-6">
            {isAdmin && (
              <>
                 <Link href="/admin/create" className="text-sm font-semibold text-[#330066] hover:text-purple-700 transition-colors px-2 py-1">
                  Create
                </Link>
                <Link href="/admin/keywords" className="text-sm font-semibold text-[#330066] hover:text-purple-700 transition-colors px-2 py-1">
                  Keywords
                </Link>
              </>
            )}
            {user && (
              <Link href="/favorites" className="text-sm font-semibold text-[#330066] hover:text-purple-700 transition-colors px-2 py-1">
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
