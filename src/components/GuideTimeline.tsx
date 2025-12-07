'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import { fetchGuides, deleteGuide } from '@/app/admin/guides/actions';
import GuideModal from './GuideModal';

interface Guide {
  id: string;
  title: string;
  introduction: string; // database column is introduction, mapped to description in UI
  publish_date: string;
  url: string;
  author: string; // mapped to source
  ch_title?: string;
  ch_introduction?: string;
}

interface GuideTimelineProps {
  isAdmin?: boolean;
}

export default function GuideTimeline({ isAdmin = false }: GuideTimelineProps) {
  const { t } = useLanguage();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);

  const loadGuides = async () => {
    setLoading(true);
    const data = await fetchGuides();
    if (data) setGuides(data as unknown as Guide[]);
    setLoading(false);
  };

  useEffect(() => {
    loadGuides();
  }, []);

  const handleCreate = () => {
    setEditingGuide(null);
    setIsModalOpen(true);
  };

  const handleEdit = (guide: Guide) => {
    setEditingGuide(guide);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this guide?')) {
      const res = await deleteGuide(id);
      if (res.success) {
        loadGuides();
      } else {
        alert('Error deleting guide');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    loadGuides(); // Refresh data after close
  };


  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 relative">
        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">
          {t('Prompting Best Practices', '提示词最佳实践')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          {t(
            'Master the art of AI image generation with our curated collection of guides and tutorials.', 
            '通过我们需要精选的指南和教程，掌握 AI 图像生成的艺术。'
          )}
        </p>

        {isAdmin && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold shadow-lg hover:transform hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('Create Guide', '创建教程')}
          </button>
        )}
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-300 via-orange-300 to-transparent" />

        <div className="space-y-12">
          {guides.map((guide, index) => {
             const displayTitle = t(guide.title, guide.ch_title);
             const displayDesc = t(guide.introduction, guide.ch_introduction);

             return (
            <div key={guide.id} className={`relative flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}>
              
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-400 border-4 border-white dark:border-gray-900 shadow-sm z-10 top-0 mt-6" />

              {/* Date Badge (Desktop Center) */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -mt-8 py-1 px-3 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-semibold text-gray-500 shadow-sm z-10 w-max">
                {guide.publish_date}
              </div>

              {/* Content Card */}
              <div className="flex-1 w-full pl-12 md:pl-0">
                <div 
                  className="group block bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 transform hover:-translate-y-1 relative"
                >
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.preventDefault(); handleEdit(guide); }}
                        className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 text-gray-600 dark:text-gray-300"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleDelete(guide.id); }}
                        className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <a 
                    href={guide.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-wider">
                        <span>{guide.author}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-orange-600 transition-colors">
                      {displayTitle}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {displayDesc}
                    </p>

                    {/* Mobile Date */}
                    <div className="md:hidden flex items-center gap-2 text-sm text-gray-400 mt-4 border-t border-gray-100 pt-4">
                      <Calendar className="w-4 h-4" />
                      {guide.publish_date}
                    </div>
                  </a>
                </div>
              </div>

               {/* Spacer for alternating layout */}
               <div className="hidden md:block flex-1" />
            </div>
          )})}
        </div>
      </div>

      <GuideModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialData={editingGuide ? {
          ...editingGuide,
          ch_title: editingGuide.ch_title || '',
          ch_introduction: editingGuide.ch_introduction || '' 
        } : undefined}
      />
    </div>
  );
}
