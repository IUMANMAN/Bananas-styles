'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Save } from 'lucide-react';
import { createGuide, updateGuide } from '@/app/admin/guides/actions';
import { useLanguage } from '@/contexts/LanguageContext';

interface GuideData {
  id?: string;
  title: string;
  introduction: string;
  url: string;
  author: string;
  publish_date: string;
  ch_title: string;
  ch_introduction: string;
}

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: GuideData | null;
}

export default function GuideModal({ isOpen, onClose, initialData }: GuideModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [formData, setFormData] = useState<GuideData>({
    title: '',
    introduction: '',
    url: '',
    author: '',
    publish_date: new Date().toISOString().split('T')[0],
    ch_title: '',
    ch_introduction: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        introduction: '',
        url: '',
        author: '',
        publish_date: new Date().toISOString().split('T')[0],
        ch_title: '',
        ch_introduction: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    let result;
    if (initialData?.id) {
      result = await updateGuide(initialData.id, data);
    } else {
      result = await createGuide(data);
    }

    setLoading(false);

    if (result.success) {
      onClose();
      // Optional: Refresh page or parent state if strictly controlled, 
      // but Server Actions revalidatePath handles data refresh on next fetch.
    } else {
      alert('Error: ' + result.error);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialData ? t('Edit Guide', '编辑教程') : t('Create New Guide', '创建新教程')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form id="guide-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Common Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Publish Date', '发布日期')}
                </label>
                <input
                  type="date"
                  required
                  value={formData.publish_date}
                  onChange={e => setFormData({...formData, publish_date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Details Link (URL)', '链接地址')}
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="https://..."
                />
              </div>

               <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Author Name', '作者名称')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g. Google Blog"
                />
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* English Content */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">English Content</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Introduction</label>
                <textarea
                  required
                  rows={3}
                  value={formData.introduction}
                  onChange={e => setFormData({...formData, introduction: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Chinese Content */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Chinese Content (Optional)</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">中文标题 (Chinese Title)</label>
                <input
                  type="text"
                  value={formData.ch_title}
                  onChange={e => setFormData({...formData, ch_title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">中文简介 (Chinese Intro)</label>
                <textarea
                  rows={3}
                  value={formData.ch_introduction}
                  onChange={e => setFormData({...formData, ch_introduction: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t('Cancel', '取消')}
          </button>
          <button
            type="submit"
            form="guide-form"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-black dark:bg-white dark:text-black hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t('Save Guide', '保存教程')}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
