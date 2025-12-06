import { Twitter, Instagram, Book } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          
          {/* Logo/Brand */}
          <div className="text-center">
            <h3 className="text-xl font-black tracking-tighter">PUMPBANANA</h3>
            <p className="text-gray-500 text-sm mt-2">
              Curated AI styles for your next generation.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="https://www.instagram.com/pumpbananas?igsh=OGQ5ZDc2ODk2ZA%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            
            <a 
              href="https://www.tiktok.com/@pumpbananas?_r=1&_t=ZT-920IkULmn78" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="TikTok"
            >
              {/* TikTok Icon SVG */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>

            <a 
              href="https://x.com/my0steric?s=21" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="X (Twitter)"
            >
              {/* X (Twitter) Icon SVG */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a 
              href="https://xhslink.com/m/A6MBRkqrmi7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all duration-300 hover:scale-110 group"
              aria-label="Little Red Book"
            >
              <Book className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} PUMPBANANA. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
