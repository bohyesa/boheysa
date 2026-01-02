
import React, { useState } from 'react';
import { Chapter, Section } from '../types';

interface TableOfContentsProps {
  chapters: Chapter[];
  onSelect: (chapter: Chapter, section: Section) => void;
  lastRead: { chapterId: string; sectionId: string } | null;
  onContinue: () => void;
  bookmarks: string[];
  onToggleBookmark: (sectionId: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  chapters, 
  onSelect, 
  lastRead, 
  onContinue, 
  bookmarks,
  onToggleBookmark 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks'>('all');

  const filteredChapters = chapters.map(chapter => {
    const matchingSections = chapter.sections.filter(s => {
      const matchesTab = activeTab === 'all' || bookmarks.includes(s.id);
      return matchesTab;
    });
    return { ...chapter, matchingSections };
  }).filter(c => 
    activeTab === 'bookmarks' 
      ? c.matchingSections.length > 0 
      : true
  );

  const lastReadTitle = lastRead 
    ? chapters.find(c => c.id === lastRead.chapterId)?.sections.find(s => s.id === lastRead.sectionId)?.title
    : (chapters[0]?.sections[0]?.title || "시작하기");

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Header */}
      <header className="p-4 pt-6 text-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">천국의비밀계시</h1>
      </header>

      {/* Tabs */}
      <div className="px-4 py-2">
        <div className="flex bg-slate-200 dark:bg-surface-dark p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'all' 
                ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            전체
          </button>
          <button 
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'bookmarks' 
                ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bookmark</span>
            북마크
            {bookmarks.length > 0 && (
              <span className="bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">
                {bookmarks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Chapters List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-28 space-y-3">
        {filteredChapters.length > 0 ? (
          filteredChapters.map((chapter) => (
            <details 
              key={chapter.id} 
              open={activeTab === 'bookmarks' || chapter.number === 0}
              className="group bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-300"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-wider">
                    {chapter.number === 0 ? 'INTRO' : `제${chapter.number}장`}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{chapter.title}</h2>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="border-t border-slate-100 dark:border-slate-800">
                {chapter.matchingSections.length > 0 ? (
                  <ul className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {chapter.matchingSections.map((section) => (
                      <li key={section.id}>
                        <div className="flex items-center group/item hover:bg-primary/5 transition-colors">
                          <button 
                            onClick={() => onSelect(chapter, section)}
                            className="flex-1 text-left px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 transition-all flex items-center justify-between"
                          >
                            <span className={lastRead?.sectionId === section.id ? 'font-bold text-primary' : ''}>
                              {section.title}
                            </span>
                            <div className="flex items-center gap-2">
                              {bookmarks.includes(section.id) && (
                                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-[1]">bookmark</span>
                              )}
                              {lastRead?.sectionId === section.id ? (
                                <span className="material-symbols-outlined text-[18px] text-primary">menu_book</span>
                              ) : (
                                <span className="material-symbols-outlined text-[18px] opacity-0 group-hover/item:opacity-100 text-primary">chevron_right</span>
                              )}
                            </div>
                          </button>
                          {activeTab === 'bookmarks' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleBookmark(section.id);
                              }}
                              className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-xs text-slate-400 italic text-center">결과 없음</div>
                )}
              </div>
            </details>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
            <span className="material-symbols-outlined text-[48px] opacity-20">
              {activeTab === 'bookmarks' ? 'bookmark_border' : 'list_alt'}
            </span>
            <p className="text-sm">
              {activeTab === 'bookmarks' ? '북마크한 내용이 없습니다.' : '목록이 비어 있습니다.'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Continue Button */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent pt-10 pointer-events-none flex justify-center">
        <button 
          onClick={onContinue}
          className="pointer-events-auto w-full max-w-[480px] h-14 bg-primary hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/25 transition-all"
        >
          <span className="material-symbols-outlined">menu_book</span>
          <span className="truncate text-sm sm:text-base px-2">이어보기: {lastReadTitle}</span>
        </button>
      </div>
    </div>
  );
};

export default TableOfContents;
