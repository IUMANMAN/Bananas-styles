import Link from 'next/link'
import AuthButton from './AuthButton'
import LanguageToggle from './LanguageToggle'
import NavLinks from './NavLinks'

import { createClient } from '@/lib/supabase/server'

export default async function NavBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'my0sterick@gmail.com'
  const isAdmin = user?.email === adminEmail

  return (
    <nav className="absolute top-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between min-h-[5rem] py-4 md:py-0 relative">
          
          {/* Logo & Title - Left Aligned (Center on Mobile) */}
          <Link href="/" className="flex items-center gap-3 group mb-4 md:mb-0">
             <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 bg-white rounded-full overflow-hidden transition-transform group-hover:scale-105 duration-300 flex items-center justify-center shadow-sm border border-gray-100">
               <img src="/banana-logo.jpeg" alt="Pumpbanana Logo" className="w-full h-full object-contain" />
             </div>
             <span className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
               Pumpbanana
             </span>
          </Link>

          {/* Right-aligned Navigation Items (Center on Mobile, Wrap if needed) */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 w-full md:w-auto md:absolute md:right-0">
            <NavLinks isAdmin={isAdmin} isLoggedIn={!!user} />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
