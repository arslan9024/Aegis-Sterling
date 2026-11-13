import React, { useState, useRef, useCallback } from 'react';
import { useMultiLevelBook } from './MultiLevelBookContext';
import { useTheme } from '../../context/ThemeContext';
import { ProtocolRef } from '../ProtocolRef';
import { ProtocolReferenceModal } from '../ProtocolReferenceModal';
import { PROTOCOL_REGISTRY, ProtocolReference } from '../../data/protocolRegistry';
import {
  BookOpen,
  ChevronRight,
  Search,
  Layers,
  FolderTree,
  FileCode2,
  Sigma,
  CornerDownRight,
  ArrowUpLeft,
  AlignLeft,
  Bookmark,
  Share2,
  Check,
  Type,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
} from 'lucide-react';

export const MultiLevelBookView: React.FC = () => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const {
    currentLibrary,
    currentBook,
    currentVolume,
    currentCanto,
    currentChapter,
    currentSubChapter,
    currentSection,
    currentTopic,
    currentArtifact,
    currentParagraph,
    currentSentence,
    currentLine,
    activeLevel,
    breadcrumbs,
    searchQuery,
    setSearchQuery,
    selectBook,
    selectVolume,
    selectCanto,
    selectChapter,
    selectSubChapter,
    selectSection,
    selectTopic,
    selectArtifact,
    selectParagraph,
    selectSentence,
    selectLine,
    returnUpOneLevel,
    resetToChapter,
  } = useMultiLevelBook();

  // Merged Executive Reader Controls:
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fontStyle, setFontStyle] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [bookmarkedNodes, setBookmarkedNodes] = useState<string[]>([currentChapter.nodeId]);
  const [activeModalProtocol, setActiveModalProtocol] = useState<ProtocolReference | null>(null);

  const handleOpenProtocolModal = (code: string) => {
    if (PROTOCOL_REGISTRY[code]) {
      setActiveModalProtocol(PROTOCOL_REGISTRY[code]);
    }
  };

  // U-03: Render text with auto ProtocolRef portals
  const renderTextWithProtocols = (text: string) => {
    if (!text) return null;
    const protocolRegex = /(TURING-[A-Z0-9-]+|AEG-\d{3})/g;
    const parts = text.split(protocolRegex);
    return parts.map((part, i) => {
      if (PROTOCOL_REGISTRY[part]) {
        return (
          <ProtocolRef
            key={i}
            code={part}
            onOpenProtocol={handleOpenProtocolModal}
          />
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  // U-01: Reading progress bar
  const [readProgress, setReadProgress] = useState(0);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const handleContentScroll = useCallback(() => {
    const el = contentScrollRef.current;
    if (!el) return;
    const scrolled = el.scrollTop;
    const total = el.scrollHeight - el.clientHeight;
    setReadProgress(total > 0 ? Math.round((scrolled / total) * 100) : 0);
  }, []);

  const toggleBookmark = (nodeId: string) => {
    setBookmarkedNodes(prev =>
      prev.includes(nodeId) ? prev.filter(n => n !== nodeId) : [...prev, nodeId]
    );
  };

  const handleCopyCoordinate = () => {
    const coord = `WhiteCaves//${currentBook.bookId}/${currentVolume.nodeId}/${currentChapter.chapterCode}`;
    navigator.clipboard?.writeText(window.location.origin + '#' + coord);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  }[fontStyle];

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className={`flex flex-col w-full rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[calc(100vh-130px)]'
      } ${
        isDark
          ? 'bg-[#090d16] border-slate-800 text-slate-100'
          : 'bg-[#fcfdfd] border-slate-200 text-slate-800'
      } ${fontClasses}`}
    >
      {/* ── Level 0 & 1: Master Header Strip ── */}
      <div
        className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-4 backdrop-blur-md transition-colors ${
          isDark ? 'bg-[#0b1222]/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-rose-500 font-bold uppercase tracking-wider">
                Level {activeLevel} / 12
              </span>
              <span className="text-slate-400">|</span>
              <h1 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white">
                {currentBook.title}
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentBook.subtitle}</p>
          </div>

          {/* Book Switcher Tabs: 1. White Caves (Project) | 2. Aegis Sterling (Autobiography) */}
          <div
            className={`hidden lg:flex items-center gap-1.5 p-1 rounded-xl border ml-2 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {currentLibrary.books.map(b => {
              const isSelected = b.bookId === currentBook.bookId;
              return (
                <button
                  key={b.bookId}
                  onClick={() => selectBook(b.bookId)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-slate-400'}`}
                  ></span>
                  <span>
                    {b.bookNumber === 1 ? 'Book 1: White Caves' : 'Book 2: Aegis Sterling (Autobiography)'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Executive Reader Merged Controls: Search, Typography, Zoom, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Omni-Search */}
          <div className="relative w-56 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search lines, protocols, math..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1 text-xs rounded-lg border transition focus:outline-none ${
                isDark
                  ? 'bg-slate-950/80 border-slate-700/60 text-slate-200 placeholder-slate-500 focus:border-purple-400'
                  : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-purple-500'
              }`}
            />
          </div>

          {/* Typography selector */}
          <div
            className={`hidden md:flex items-center text-xs rounded-lg border px-1.5 py-1 gap-1 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            <button
              onClick={() => setFontStyle('sans')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-sans ${
                fontStyle === 'sans'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Sans
            </button>
            <button
              onClick={() => setFontStyle('serif')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-serif ${
                fontStyle === 'serif'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontStyle('mono')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                fontStyle === 'mono'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Mono
            </button>
          </div>

          {/* Zoom controls */}
          <div
            className={`hidden sm:flex items-center text-xs font-mono rounded-lg border px-2 py-1 gap-1.5 ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <button
              onClick={() => setZoomLevel(z => Math.max(80, z - 10))}
              className="hover:text-purple-500 font-bold px-1"
              title="Zoom Out"
            >
              -
            </button>
            <span>{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(z => Math.min(140, z + 10))}
              className="hover:text-purple-500 font-bold px-1"
              title="Zoom In"
            >
              +
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(currentChapter.nodeId)}
            className={`p-2 rounded-lg border transition-all ${
              bookmarkedNodes.includes(currentChapter.nodeId)
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-500'
                : isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Bookmark Node"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Share/Copy Coordinate */}
          <button
            onClick={handleCopyCoordinate}
            className={`p-2 rounded-lg border transition-all ${
              copiedLink
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500'
                : isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
            title="Copy Coordinate Anchor"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Zen Mode */}
          <button
            onClick={() => setIsFullscreen(f => !f)}
            className={`p-2 rounded-lg border transition-all ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Zen Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-indigo-700 hover:bg-slate-200'
            }`}
            title={`Toggle Theme (Current: ${theme})`}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── U-01: Chapter Reading Progress Bar ── */}
      <div
        className={`h-1 w-full transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-slate-200'
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-200"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* ── Level 3 & 4: Volume & Canto Horizontal Selection Strip ── */}
      <div
        className={`px-5 py-2 border-b flex items-center gap-2 overflow-x-auto scrollbar-none transition-colors ${
          isDark ? 'bg-slate-950/95 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold flex items-center gap-1 mr-2">
          <Layers className="w-3.5 h-3.5 text-purple-500" /> Volumes:
        </span>
        {currentBook.volumes.map(vol => (
          <button
            key={vol.nodeId}
            onClick={() => selectVolume(vol.nodeId)}
            className={`px-3 py-1 rounded text-xs font-semibold transition whitespace-nowrap ${
              vol.nodeId === currentVolume.nodeId
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : isDark
                ? 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            Vol {vol.volumeNumber}: {vol.title.split(': ')[1] || vol.title}
          </button>
        ))}

        <div className={`h-4 w-[1px] mx-2 ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />

        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Cantos:</span>
        {currentVolume.cantos.map(canto => (
          <button
            key={canto.nodeId}
            onClick={() => selectCanto(canto.nodeId)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${
              canto.nodeId === currentCanto.nodeId
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                : isDark
                ? 'bg-slate-900/40 text-slate-400 hover:text-slate-200'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Canto {canto.cantoNumber}: {canto.title.split(': ')[1] || canto.title}
          </button>
        ))}
      </div>

      {/* ── Main Viewport Split: 12-Level Vertical Navigator vs Deep Content ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Structure Accordion (Level 5 to Level 12) */}
        <aside
          className={`w-80 border-r flex flex-col overflow-y-auto p-3 space-y-3 scrollbar-thin transition-colors ${
            isDark ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-purple-500" /> Structure Mesh (L5-L12)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {currentCanto.chapters.length} Ch
            </span>
          </div>

          {currentCanto.chapters.map(ch => {
            const isChapterActive = ch.nodeId === currentChapter.nodeId;
            return (
              <div
                key={ch.nodeId}
                className={`rounded-xl border transition ${
                  isChapterActive
                    ? isDark
                      ? 'border-purple-500/40 bg-purple-950/20'
                      : 'border-purple-300 bg-purple-50/70 shadow-xs'
                    : isDark
                    ? 'border-slate-800/80 bg-slate-900/30 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                }`}
              >
                {/* Level 5: Chapter */}
                <button
                  onClick={() => selectChapter(ch.nodeId)}
                  className="w-full text-left p-3 flex items-start justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                        {ch.chapterCode}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ch.readTimeMinutes}m read
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition leading-snug">
                      {ch.title.split(': ')[1] || ch.title}
                    </div>
                  </div>
                </button>

                {/* Sub-Tree for Active Chapter */}
                {isChapterActive && (
                  <div
                    className={`px-2 pb-2 pt-1 border-t space-y-2 ${
                      isDark ? 'border-slate-800/60' : 'border-purple-100'
                    }`}
                  >
                    {ch.subChapters.map(subCh => {
                      const isSubActive = currentSubChapter?.nodeId === subCh.nodeId;
                      return (
                        <div
                          key={subCh.nodeId}
                          className={`space-y-1 pl-2 border-l ${
                            isDark ? 'border-slate-800' : 'border-slate-300'
                          }`}
                        >
                          {/* Level 6: Sub-Chapter */}
                          <button
                            onClick={() => selectSubChapter(subCh.nodeId)}
                            className={`w-full text-left text-[11px] font-semibold py-0.5 transition flex items-center justify-between ${
                              isSubActive
                                ? 'text-purple-600 dark:text-purple-400 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <span>L6: Sub-Ch {subCh.subChapterNumber}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {subCh.sections.length} sec
                            </span>
                          </button>

                          {/* Level 7: Sections */}
                          {isSubActive && (
                            <div className="space-y-1 pl-2">
                              {subCh.sections.map(sec => {
                                const isSecActive = currentSection?.nodeId === sec.nodeId;
                                return (
                                  <div key={sec.nodeId}>
                                    <button
                                      onClick={() => selectSection(sec.nodeId)}
                                      className={`w-full text-left text-[11px] py-0.5 transition truncate flex items-center gap-1 ${
                                        isSecActive
                                          ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                      }`}
                                    >
                                      <span className="opacity-70">&bull;</span>
                                      <span className="truncate">
                                        L7: Sec {sec.sectionNumber} - {sec.title.split(': ')[1] || sec.title}
                                      </span>
                                    </button>

                                    {/* Level 8: Topics */}
                                    {isSecActive && (
                                      <div className="pl-3 py-1 space-y-1">
                                        {sec.topics.map(top => {
                                          const isTopActive = currentTopic?.nodeId === top.nodeId;
                                          return (
                                            <div key={top.nodeId}>
                                              <button
                                                onClick={() => selectTopic(top.nodeId)}
                                                className={`w-full text-left text-[10px] py-0.5 font-mono transition flex items-center gap-1 ${
                                                  isTopActive
                                                    ? 'text-rose-500 font-bold'
                                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                                }`}
                                              >
                                                <span>&rarr;</span>
                                                <span className="truncate">
                                                  L8: T-{top.topicNumber} ({top.artifacts.length} art)
                                                </span>
                                              </button>

                                              {/* Level 9: Artifacts */}
                                              {isTopActive && (
                                                <div className="pl-3 py-1 space-y-0.5">
                                                  {top.artifacts.map(art => (
                                                    <button
                                                      key={art.nodeId}
                                                      onClick={() => selectArtifact(art.nodeId)}
                                                      className={`w-full text-left text-[9px] font-mono py-0.5 px-1 rounded transition flex items-center gap-1 ${
                                                        currentArtifact?.nodeId === art.nodeId
                                                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold'
                                                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                                      }`}
                                                    >
                                                      <FileCode2 className="w-2.5 h-2.5" />
                                                      <span className="truncate">
                                                        L9: #{art.artifactNumber} [{art.type}]
                                                      </span>
                                                    </button>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* Right Viewport: Complete 12-Level Presentation Body */}
        <main
          className={`flex-1 flex flex-col overflow-hidden transition-colors ${
            isDark ? 'bg-[#030712]' : 'bg-[#fafbfe]'
          }`}
        >
          {/* Breadcrumb Strip */}
          <div
            className={`px-6 py-2.5 border-b flex items-center justify-between text-xs transition-colors ${
              isDark ? 'bg-[#070b14] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-slate-500 dark:text-slate-400">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={bc.pathId + idx}>
                  <span className="hover:text-purple-600 dark:hover:text-purple-400 font-mono text-[11px] whitespace-nowrap cursor-pointer">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">
                      {bc.levelName.split(':')[0]}:
                    </span>{' '}
                    {bc.label}
                  </span>
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Level Return Controls */}
            <div className="flex items-center gap-2">
              {activeLevel > 5 && (
                <button
                  onClick={returnUpOneLevel}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-purple-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-purple-700 border border-slate-200'
                  }`}
                  title="Return up one level in hierarchy"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5" /> Up to L{activeLevel - 1}
                </button>
              )}
              {activeLevel > 5 && (
                <button
                  onClick={resetToChapter}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  Back to Chapter (L5)
                </button>
              )}
            </div>
          </div>

          {/* Deep Level Presentation Body (Scaled via zoomLevel) */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl mx-auto w-full"
            ref={contentScrollRef}
            onScroll={handleContentScroll}
          >
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
                width: `${(100 / zoomLevel) * 100}%`,
              }}
              className="space-y-6"
            >
              {/* If at Level 9 - 12 (Artifact, Paragraph, Sentence, Line) */}
              {currentArtifact ? (
                <div className="space-y-6">
                  {/* Level 9: Artifact Header */}
                  <div
                    className={`p-5 rounded-2xl border shadow-sm ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wider border border-rose-200 dark:border-rose-800">
                        Level 9 Artifact #{currentArtifact.artifactNumber} [{currentArtifact.type}]
                      </span>
                      {currentArtifact.complexity && (
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          Complexity: {currentArtifact.complexity}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {currentArtifact.title}
                    </h2>
                    {currentArtifact.filePath && (
                      <div className="text-xs font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mt-2">
                        <FileCode2 className="w-4 h-4" /> {currentArtifact.filePath}
                        {currentArtifact.totalLines && (
                          <span className="text-slate-400">
                            ({currentArtifact.totalLines} lines)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Level 10: Paragraphs */}
                  <div className="space-y-4">
                    {currentArtifact.paragraphs.map(p => {
                      const isPActive = currentParagraph?.nodeId === p.nodeId;
                      return (
                        <div
                          key={p.nodeId}
                          onClick={() => selectParagraph(p.nodeId)}
                          className={`p-5 rounded-2xl border transition cursor-pointer ${
                            isPActive
                              ? isDark
                                ? 'bg-slate-900/90 border-purple-500/50 shadow-md'
                                : 'bg-purple-50/60 border-purple-300 shadow-sm'
                              : isDark
                              ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-mono text-purple-600 dark:text-purple-400 mb-2">
                            <span className="flex items-center gap-1.5 font-bold">
                              <AlignLeft className="w-3.5 h-3.5" /> Level 10 Paragraph &para;{' '}
                              {p.paragraphNumber}
                            </span>
                            <span className="text-slate-400">{p.sentences.length} sentences</span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {p.header}
                          </h3>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            {renderTextWithProtocols(p.narrative)}
                          </p>

                          {/* Math formulas if present */}
                          {p.mathFormulas?.map((mf, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-xl border my-3 space-y-1.5 ${
                                isDark
                                  ? 'bg-purple-950/30 border-purple-800/40'
                                  : 'bg-purple-50 border-purple-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                                <Sigma className="w-4 h-4" />
                                <span>{mf.title}</span>
                              </div>
                              <div
                                className={`p-2.5 rounded-lg font-mono text-sm overflow-x-auto ${
                                  isDark ? 'bg-black/50 text-purple-200' : 'bg-white text-purple-900 border border-purple-200'
                                }`}
                              >
                                {mf.latex}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                {mf.explanation}
                              </p>
                            </div>
                          ))}

                          {/* Level 11: Sentences */}
                          <div className="space-y-2 mt-4 pt-4 border-t border-inherit">
                            {p.sentences.map(sent => {
                              const isSActive = currentSentence?.nodeId === sent.nodeId;
                              return (
                                <div
                                  key={sent.nodeId}
                                  onClick={ev => {
                                    ev.stopPropagation();
                                    selectParagraph(p.nodeId);
                                    selectSentence(sent.nodeId);
                                  }}
                                  className={`p-3 rounded-xl border transition ${
                                    isSActive
                                      ? isDark
                                        ? 'bg-purple-950/40 border-purple-500/60'
                                        : 'bg-purple-100/70 border-purple-400'
                                      : isDark
                                      ? 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-900'
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                      <CornerDownRight className="w-3 h-3" /> Level 11 Sentence #{sent.sentenceNumber}
                                    </span>
                                    {sent.statutoryInvariant && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                        Statutory Invariant
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                                    {renderTextWithProtocols(sent.statement)}
                                  </p>

                                  {/* Level 12: Code Lines */}
                                  <div className="mt-2.5 pt-2 border-t border-inherit space-y-1 font-mono text-[11px]">
                                    {sent.lines.map(line => {
                                      const isLActive = currentLine?.nodeId === line.nodeId;
                                      return (
                                        <div
                                          key={line.nodeId}
                                          onClick={ev => {
                                            ev.stopPropagation();
                                            selectParagraph(p.nodeId);
                                            selectSentence(sent.nodeId);
                                            selectLine(line.nodeId);
                                          }}
                                          className={`px-2 py-1 rounded flex items-center gap-3 transition ${
                                            isLActive
                                              ? 'bg-purple-500/20 text-purple-700 dark:text-purple-200 border border-purple-500/40'
                                              : isDark
                                              ? 'hover:bg-slate-800/60 text-slate-300'
                                              : 'hover:bg-slate-200 text-slate-700'
                                          }`}
                                        >
                                          <span className="text-slate-400 select-none w-6 text-right font-mono text-[10px]">
                                            {line.lineNumber}
                                          </span>
                                          <code className="flex-1">{line.text}</code>
                                          {line.tokenType && (
                                            <span
                                              className={`text-[9px] px-1 rounded ${
                                                isDark ? 'bg-black/40 text-slate-400' : 'bg-slate-200 text-slate-600'
                                              }`}
                                            >
                                              {line.tokenType}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Level 5 Chapter Viewport Baseline */
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded font-mono text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                        Level 5: {currentChapter.chapterCode}
                      </span>
                      <span className="text-xs text-slate-400">
                        {currentChapter.readTimeMinutes} min read
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {currentChapter.title}
                    </h2>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-1 mb-4">
                      {currentChapter.subtitle}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentChapter.subChapters.map(subCh => (
                      <div
                        key={subCh.nodeId}
                        className={`p-6 rounded-2xl border space-y-3 shadow-xs ${
                          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                            Level 6 Sub-Chapter {subCh.subChapterNumber}: {subCh.title}
                          </h3>
                          <span className="text-xs font-mono text-slate-400">
                            {subCh.sections.length} Sections
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {renderTextWithProtocols(subCh.summary)}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                          {subCh.sections.map(sec => (
                            <div
                              key={sec.nodeId}
                              onClick={() => {
                                selectSubChapter(subCh.nodeId);
                                selectSection(sec.nodeId);
                              }}
                              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                                isDark
                                  ? 'bg-slate-950/60 border-slate-800 hover:border-purple-500/50'
                                  : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                              }`}
                            >
                              <div className="truncate mr-2">
                                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                                  Section {sec.sectionNumber}
                                </span>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate block">
                                  {sec.title.split(': ')[1] || sec.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {sec.topics.length} topics
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* U-02: Prev / Next Chapter Navigator */}
          {(() => {
            const chapters = currentCanto.chapters;
            const idx = chapters.findIndex(c => c.nodeId === currentChapter.nodeId);
            const prevCh = idx > 0 ? chapters[idx - 1] : null;
            const nextCh = idx < chapters.length - 1 ? chapters[idx + 1] : null;
            if (!prevCh && !nextCh) return null;
            return (
              <div
                className={`flex items-center justify-between gap-4 px-6 py-4 border-t text-sm transition-colors ${
                  isDark ? 'border-slate-800 bg-[#070b14]' : 'border-slate-200 bg-white shadow-xs'
                }`}
              >
                {prevCh ? (
                  <button
                    onClick={() => { selectChapter(prevCh.nodeId); setReadProgress(0); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all max-w-[45%] ${
                      isDark
                        ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xs'
                    }`}
                  >
                    <ArrowUpLeft className="w-4 h-4 flex-shrink-0 text-purple-500" />
                    <div className="text-left min-w-0">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Previous</div>
                      <div className="text-xs font-semibold truncate">{prevCh.title.split(': ')[1] || prevCh.title}</div>
                    </div>
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">
                    {idx + 1} / {chapters.length}
                  </span>
                  <div className="flex gap-1">
                    {chapters.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { selectChapter(chapters[i].nodeId); setReadProgress(0); }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === idx ? 'bg-purple-500 w-4' : isDark ? 'bg-slate-700 hover:bg-slate-500' : 'bg-slate-300 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {nextCh ? (
                  <button
                    onClick={() => { selectChapter(nextCh.nodeId); setReadProgress(0); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all max-w-[45%] ${
                      isDark
                        ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xs'
                    }`}
                  >
                    <div className="text-right min-w-0">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Next</div>
                      <div className="text-xs font-semibold truncate">{nextCh.title.split(': ')[1] || nextCh.title}</div>
                    </div>
                    <CornerDownRight className="w-4 h-4 flex-shrink-0 text-purple-500" />
                  </button>
                ) : (
                  <span />
                )}
              </div>
            );
          })()}
        </main>
      </div>

      {/* Protocol Inspector Modal triggered by inline text badge */}
      {activeModalProtocol && (
        <ProtocolReferenceModal
          protocol={activeModalProtocol}
          onClose={() => setActiveModalProtocol(null)}
          onSelectProtocol={(code) => {
            if (PROTOCOL_REGISTRY[code]) {
              setActiveModalProtocol(PROTOCOL_REGISTRY[code]);
            }
          }}
          onNavigateToChapter={() => {
            setActiveModalProtocol(null);
          }}
        />
      )}
    </div>
  );
};

export default MultiLevelBookView;
