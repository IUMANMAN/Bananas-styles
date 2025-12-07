'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center p-2 rounded-full text-black hover:bg-gray-100 transition-colors"
      title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
    >
      <Globe className="w-5 h-5 mr-1" />
      <span className="text-sm font-bold uppercase">{language === 'en' ? 'EN' : '中'}</span>
    </button>
  );
}
