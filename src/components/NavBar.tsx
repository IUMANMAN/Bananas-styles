import Link from 'next/link'
import AuthButton from './AuthButton'

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Bananas
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/keywords" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Admin
            </Link>
            <Link href="/favorites" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              My Likes
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
