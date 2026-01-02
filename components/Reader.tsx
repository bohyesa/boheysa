
import React, { useState } from 'react';
import { Chapter, Section } from '../types';

interface ReaderProps {
  chapter: Chapter;
  section: Section;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

type FontSize = 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';

const Reader: React.FC<ReaderProps> = ({ 
  chapter, 
  section, 
  onBack, 
  onNext, 
  onPrev,
  isBookmarked,
  onToggleBookmark
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<FontSize>('text-lg');
  const [showFontMenu, setShowFontMenu] = useState(false);

  const toggleHighlight = (idx: number) => {
    setHighlightedIndex(highlightedIndex === idx ? null : idx);
  };

  const fontOptions: { label: string; value: FontSize; icon: string }[] = [
    { label: '작게', value: 'text-base', icon: 'text_fields' },
    { label: '보통', value: 'text-lg', icon: 'text_fields' },
    { label: '크게', value: 'text-xl', icon: 'text_fields' },
    { label: '아주 크게', value: 'text-2xl', icon: 'text_fields' },
  ];

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark transition-colors duration-300 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 h-14">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          
          <div className="flex flex-col items-center flex-1 mx-2 overflow-hidden">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate w-full text-center">
              {chapter.number === 0 ? '' : `제${chapter.number}장 `}{chapter.title}
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight truncate w-full text-center">
              {section.title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={onToggleBookmark}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isBookmarked ? 'text-amber-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isBookmarked ? 'fill-[1]' : ''}`}>
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
            <button 
              onClick={() => setShowFontMenu(!showFontMenu)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                showFontMenu ? 'bg-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">text_fields</span>
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${(chapter.number / 6) * 100}%` }}
          />
        </div>

        {/* Font Size Menu Overlay */}
        {showFontMenu && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-surface-dark shadow-xl border-b border-slate-200 dark:border-slate-800 p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="flex items-center justify-between gap-2">
              {fontOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFontSize(opt.value)}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    fontSize === opt.value 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className={`material-symbols-outlined`} style={{ fontSize: opt.value === 'text-base' ? '18px' : opt.value === 'text-lg' ? '22px' : opt.value === 'text-xl' ? '26px' : '30px' }}>
                    {opt.icon}
                  </span>
                  <span className="text-[10px] font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Font Menu Backdrop */}
      {showFontMenu && (
        <div 
          className="fixed inset-0 z-30 bg-black/5" 
          onClick={() => setShowFontMenu(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-8 pb-32">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {section.title.split('. ')[1] || section.title}
          </h2>
          <div className="w-10 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          {section.content.map((para, idx) => (
            <p 
              key={idx}
              onClick={() => toggleHighlight(idx)}
              className={`${fontSize} leading-[1.8] text-slate-800 dark:text-slate-200 break-keep cursor-pointer transition-all duration-300 rounded-lg p-1 -mx-1 ${
                highlightedIndex === idx ? 'bg-primary/10 ring-1 ring-primary/20' : ''
              }`}
            >
              {para.startsWith('*') ? (
                <span className="flex items-start">
                  <span className="text-primary font-bold mr-1.5 mt-0.5">*</span>
                  <span>{para.substring(2)}</span>
                </span>
              ) : para}
            </p>
          ))}
        </div>

        <div className="mt-12 mb-8 flex flex-col items-center gap-2">
           <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
             <span className="material-symbols-outlined text-[14px]">touch_app</span>
             구절을 탭하여 하이라이트
           </span>
        </div>
      </main>

      {/* Navigation Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 pointer-events-none z-30">
        <div className="max-w-md mx-auto flex items-center justify-between pointer-events-auto">
          {/* Previous Button */}
          <button 
            onClick={onPrev}
            className="group flex items-center gap-3 pl-3 pr-5 py-3 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-all"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">PREV</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">이전</span>
            </div>
          </button>

          {/* Chapter Indicator */}
          <div className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-xl max-w-[140px] truncate text-center">
             {chapter.number === 0 ? '' : `${chapter.number}장 `}{chapter.title}
          </div>

          {/* Next Button */}
          <button 
            onClick={onNext}
            className="group flex items-center gap-3 pl-5 pr-3 py-3 rounded-full bg-primary shadow-xl shadow-primary/25 active:scale-90 transition-all"
          >
            <div className="flex flex-col items-end leading-none">
              <span className="text-[9px] font-bold text-white/60 uppercase">NEXT</span>
              <span className="text-sm font-bold text-white">다음</span>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reader;
