
import React, { useState, useEffect } from 'react';
import { Chapter, Section, ViewState } from './types';
import { chapters } from './data';
import TableOfContents from './components/TableOfContents';
import Reader from './components/Reader';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('toc');
  const [currentChapter, setCurrentChapter] = useState<Chapter>(chapters[0]);
  const [currentSection, setCurrentSection] = useState<Section>(chapters[0].sections[0]);
  const [lastRead, setLastRead] = useState<{ chapterId: string; sectionId: string } | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load bookmarks and last read from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('heavenly_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    const savedLastRead = localStorage.getItem('heavenly_last_read');
    if (savedLastRead) {
      setLastRead(JSON.parse(savedLastRead));
    }
  }, []);

  // Sync bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('heavenly_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Sync last read to localStorage
  useEffect(() => {
    if (lastRead) {
      localStorage.setItem('heavenly_last_read', JSON.stringify(lastRead));
    }
  }, [lastRead]);

  const toggleBookmark = (sectionId: string) => {
    setBookmarks(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  const handleSelectSection = (chapter: Chapter, section: Section) => {
    setCurrentChapter(chapter);
    setCurrentSection(section);
    setView('reader');
    setLastRead({ chapterId: chapter.id, sectionId: section.id });
  };

  const handleBackToToc = () => {
    setView('toc');
  };

  const handleNextSection = () => {
    const currentChapterIdx = chapters.findIndex(c => c.id === currentChapter.id);
    const currentSectionIdx = currentChapter.sections.findIndex(s => s.id === currentSection.id);

    if (currentSectionIdx < currentChapter.sections.length - 1) {
      handleSelectSection(currentChapter, currentChapter.sections[currentSectionIdx + 1]);
    } else if (currentChapterIdx < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIdx + 1];
      if (nextChapter.sections.length > 0) {
        handleSelectSection(nextChapter, nextChapter.sections[0]);
      }
    }
  };

  const handlePrevSection = () => {
    const currentChapterIdx = chapters.findIndex(c => c.id === currentChapter.id);
    const currentSectionIdx = currentChapter.sections.findIndex(s => s.id === currentSection.id);

    if (currentSectionIdx > 0) {
      handleSelectSection(currentChapter, currentChapter.sections[currentSectionIdx - 1]);
    } else if (currentChapterIdx > 0) {
      const prevChapter = chapters[currentChapterIdx - 1];
      if (prevChapter.sections.length > 0) {
        handleSelectSection(prevChapter, prevChapter.sections[prevChapter.sections.length - 1]);
      }
    }
  };

  const continueReading = () => {
    if (lastRead) {
      const chapter = chapters.find(c => c.id === lastRead.chapterId);
      if (chapter) {
        const section = chapter.sections.find(s => s.id === lastRead.sectionId);
        if (section) {
          handleSelectSection(chapter, section);
          return;
        }
      }
    }
    handleSelectSection(chapters[0], chapters[0].sections[0]);
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden flex flex-col relative transition-colors duration-300">
      {view === 'toc' ? (
        <TableOfContents 
          chapters={chapters} 
          onSelect={handleSelectSection} 
          lastRead={lastRead}
          onContinue={continueReading}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
        />
      ) : (
        <Reader 
          chapter={currentChapter} 
          section={currentSection} 
          onBack={handleBackToToc}
          onNext={handleNextSection}
          onPrev={handlePrevSection}
          isBookmarked={bookmarks.includes(currentSection.id)}
          onToggleBookmark={() => toggleBookmark(currentSection.id)}
        />
      )}
    </div>
  );
};

export default App;
