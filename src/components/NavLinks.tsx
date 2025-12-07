'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavLinksProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export default function NavLinks({ isAdmin, isLoggedIn }: NavLinksProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <Link 
        href="/guides" 
        className="text-sm font-bold text-black dark:text-white hover:opacity-70 transition-opacity px-2 py-1"
      >
        {t('Guides', '教程')}
      </Link>

      {isAdmin && (
        <>
          <Link href="/admin/create" className="text-sm font-bold text-black dark:text-white hover:opacity-70 transition-opacity px-2 py-1">
            {t('Create', '创建')}
          </Link>
          <Link href="/admin/keywords" className="text-sm font-bold text-black dark:text-white hover:opacity-70 transition-opacity px-2 py-1">
            {t('Keywords', '关键词')}
          </Link>
        </>
      )}
      
      {isLoggedIn && (
        <Link href="/favorites" className="text-sm font-bold text-black dark:text-white hover:opacity-70 transition-opacity px-2 py-1">
          {t('My Likes', '我的收藏')}
        </Link>
      )}
    </div>
  );
}
