import React, { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BOOK_CHAPTERS, TOPIC_GLOSSARY } from '../data/bookData';
import {
  Search,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Home,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Bookmark,
  Share2,
  Check,
  Type,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const BookKnowledgeViewer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedSlug, setSelectedSlug] = useState<string>('chapter-10-frontend-server-connection');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fontStyle, setFontStyle] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>(['chapter-10-frontend-server-connection']);

  const categories = useMemo(() => {
    const cats = new Set(BOOK_CHAPTERS.map(c => c.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredChapters = useMemo(() => {
    return BOOK_CHAPTERS.filter(chapter => {
      const matchesCategory = activeCategory === 'All' || chapter.category === activeCategory;
      const matchesSearch =
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const currentChapter = useMemo(() => {
    return BOOK_CHAPTERS.find(c => c.slug === selectedSlug) || BOOK_CHAPTERS[0];
  }, [selectedSlug]);

  const currentIndex = useMemo(() => {
    return BOOK_CHAPTERS.findIndex(c => c.slug === currentChapter.slug);
  }, [currentChapter]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedSlug(BOOK_CHAPTERS[currentIndex - 1].slug);
    }
  };

  const handleNext = () => {
    if (currentIndex < BOOK_CHAPTERS.length - 1) {
      setSelectedSlug(BOOK_CHAPTERS[currentIndex + 1].slug);
    }
  };

  const toggleBookmark = (slug: string) => {
    setBookmarkedChapters(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + currentChapter.file);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  }[fontStyle];

  return (
    <div className={`flex flex-col w-full rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[calc(100vh-140px)]'
    } ${
      theme === 'dark'
        ? 'bg-[#090d16] border-slate-800 text-slate-100'
        : 'bg-[#f8fafc] border-slate-200 text-slate-800'
    }`}>
      {/* ── Top Knowledge Hub Bar & Two-Way Breadcrumbs ── */}
      <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-md ${
        theme === 'dark' ? 'bg-[#0b1222]/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        {/* Two-Way Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => setSelectedSlug(BOOK_CHAPTERS[0].slug)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-purple-500 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Aegis Sovereign Hub</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-400 font-medium">The Living Book</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2 py-0.5 rounded-md font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20">
            {currentChapter.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold truncate max-w-[200px] sm:max-w-xs text-rose-500">
            {currentChapter.title.split(':')[0]}
          </span>
        </div>

        {/* Global Book Controls: Light/Dark, Font, Zoom, Fullscreen, Standalone */}
        <div className="flex items-center gap-2">
          {/* Typography selector */}
          <div className={`hidden md:flex items-center text-xs rounded-lg border px-1.5 py-1 gap-1 ${
            theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}>
            <Type className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            <button
              onClick={() => setFontStyle('sans')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-sans ${fontStyle === 'sans' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sans
            </button>
            <button
              onClick={() => setFontStyle('serif')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-serif ${fontStyle === 'serif' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontStyle('mono')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${fontStyle === 'mono' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Mono
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(currentChapter.slug)}
            className={`p-2 rounded-lg border transition-all ${
              bookmarkedChapters.includes(currentChapter.slug)
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={bookmarkedChapters.includes(currentChapter.slug) ? 'Bookmarked' : 'Add Bookmark'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Refresh Frame */}
          <button
            onClick={() => setIframeKey(k => k + 1)}
            className={`p-2 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Reload Chapter"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Zoom controls */}
          <div className={`hidden sm:flex items-center text-xs font-mono rounded-lg border px-2 py-1 gap-1.5 ${
            theme === 'dark' ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-600'
          }`}>
            <button
              onClick={() => setZoomLevel(z => Math.max(80, z - 10))}
              className="hover:text-purple-400 font-bold px-1"
              title="Zoom Out"
            >
              -
            </button>
            <span>{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(z => Math.min(140, z + 10))}
              className="hover:text-purple-400 font-bold px-1"
              title="Zoom In"
            >
              +
            </button>
          </div>

          {/* Share/Copy Link */}
          <button
            onClick={handleCopyLink}
            className={`p-2 rounded-lg border transition-all ${
              copiedLink
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
            title="Copy Chapter Link"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(f => !f)}
            className={`p-2 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Zen Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Standalone Link */}
          <a
            href={currentChapter.file}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
            title="Open pure HTML standalone view"
          >
            <span>Standalone</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── Main Book Viewport: Sidebar Explorer & Reading Canvas ── */}
      <div className={`flex-1 flex overflow-hidden ${fontClasses}`}>
        {/* Left Interactive Chapter Explorer */}
        <aside className={`w-80 flex-shrink-0 border-r flex flex-col transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Search Box */}
          <div className="p-3 border-b border-inherit">
            <div className={`relative flex items-center rounded-xl border px-3 py-2 text-xs ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-50 border-slate-300'
            }`}>
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search chapters, laws, topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none placeholder-slate-400"
              />
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] whitespace-nowrap px-2.5 py-0.5 rounded-full font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                      : theme === 'dark'
                      ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Navigation Tree */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredChapters.map((chap) => {
              const isSelected = chap.slug === currentChapter.slug;
              const isBookmarked = bookmarkedChapters.includes(chap.slug);
              return (
                <button
                  key={chap.id}
                  onClick={() => setSelectedSlug(chap.slug)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 relative ${
                    isSelected
                      ? theme === 'dark'
                        ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-md shadow-purple-950/50'
                        : 'bg-purple-50 border-purple-300 text-purple-950 shadow-sm'
                      : theme === 'dark'
                      ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-rose-500">{chap.id.toUpperCase()}</span>
                      {isBookmarked && <Bookmark className="w-3 h-3 text-amber-400 fill-current" />}
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">{chap.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-xs leading-snug">{chap.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{chap.subtitle}</p>

                  {/* Topic Tags */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {chap.topics.slice(0, 3).map(top => (
                      <span
                        key={top}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          theme === 'dark'
                            ? 'bg-slate-800 text-sky-400 border border-sky-400/20'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Topic Glossary Cloud */}
          <div className={`p-3 border-t text-xs ${
            theme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Hyperlink Knowledge Cloud
              </span>
              <span className="text-[10px] text-slate-400">Click to jump</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {Object.keys(TOPIC_GLOSSARY).map(term => (
                <button
                  key={term}
                  onClick={() => setSelectedSlug(TOPIC_GLOSSARY[term].targetSlug)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-sky-400 hover:border-rose-500 hover:text-rose-400'
                      : 'bg-white border-slate-300 text-sky-700 hover:border-rose-500 hover:text-rose-600'
                  }`}
                  title={TOPIC_GLOSSARY[term].definition}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Dynamic Reading Canvas */}
        <main className={`flex-1 flex flex-col overflow-hidden ${
          theme === 'dark' ? 'bg-[#030712]' : 'bg-[#ffffff]'
        }`}>
          {/* Chapter Metadata Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'bg-[#070b14] border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                  Author: Ms. Aegis Sterling
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-400 font-mono">{currentChapter.readTime}</span>
              </div>
              <h1 className={`text-lg font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {currentChapter.title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">{currentChapter.subtitle}</p>
            </div>

            {/* Next / Previous Navigator */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex <= 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Prev Chapter
              </button>
              <span className="text-xs font-mono text-slate-400 px-1">
                {currentIndex + 1} / {BOOK_CHAPTERS.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentIndex >= BOOK_CHAPTERS.length - 1}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Next Chapter <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Seamless Chapter Viewport */}
          <div className="flex-1 w-full relative overflow-hidden bg-transparent">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
                width: `${(100 / zoomLevel) * 100}%`,
                height: `${(100 / zoomLevel) * 100}%`,
              }}
              className="w-full h-full"
            >
              <iframe
                key={`${currentChapter.slug}-${theme}-${iframeKey}`}
                src={`${currentChapter.file}?theme=${theme}`}
                title={currentChapter.title}
                className={`w-full h-full border-0 transition-opacity duration-300 ${
                  theme === 'light' ? 'filter invert hue-rotate-180 contrast-95' : ''
                }`}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookKnowledgeViewer;
