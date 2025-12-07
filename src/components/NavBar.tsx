import Link from 'next/link'
import AuthButton from './AuthButton'
import LanguageToggle from './LanguageToggle'

import { createClient } from '@/lib/supabase/server'

export default async function NavBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'my0sterick@gmail.com'
  const isAdmin = user?.email === adminEmail

  return (
    <nav className="absolute top-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 relative">
          
          {/* Logo & Title - Left Aligned */}
          {/* Logo & Title - Left Aligned */}
          {/* Logo & Title - Left Aligned */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 bg-white rounded-full overflow-hidden transition-transform group-hover:scale-105 duration-300 flex items-center justify-center">
               <img src="/banana-logo.jpeg" alt="Pumpbanana Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
              Pumpbanana
            </span>
          </Link>

          {/* Right-aligned Navigation Items */}
          <div className="absolute right-0 flex items-center gap-4 sm:gap-6">
            {isAdmin && (
              <>
                 <Link href="/admin/create" className="text-sm font-bold text-black dark:text-white hover:opacity-70 transition-opacity px-2 py-1">
                  Create
                </Link>
                <Link href="/admin/keywords" className="text-sm font-bold text-black dark:text-white hover:opacity-70 transition-opacity px-2 py-1">
                  Keywords
                </Link>
              </>
            )}
            {user && (
              <Link href="/favorites" className="text-sm font-bold text-black dark:text-white hover:opacity-70 transition-opacity px-2 py-1">
                My Likes
              </Link>
            )}
            <div className="ml-2">
              <LanguageToggle />
            </div>
            <div className="ml-2">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
