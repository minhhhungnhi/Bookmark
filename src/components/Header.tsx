import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Mic,
  Plus,
  Bell,
  Sun,
  Moon,
  X,
  FolderPlus,
  Download,
  RotateCcw,
  Check,
  Video as VideoIcon,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e?: React.FormEvent) => void;
  onOpenVoiceSearch: () => void;
  onOpenAddVideo: () => void;
  onOpenPlaylistModal: () => void;
  onOpenBackupModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onGoHome: () => void;
  videoCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenVoiceSearch,
  onOpenAddVideo,
  onOpenPlaylistModal,
  onOpenBackupModal,
  theme,
  onToggleTheme,
  onGoHome,
  videoCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Welcome to your YouTube Library!',
      desc: 'Embed your favorite videos, create playlists, and take timestamped notes.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      title: 'Pro Tip: YouTube URLs supported',
      desc: 'Paste any youtu.be, standard, or Shorts link to instantly auto-fetch thumbnails and titles.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: `${videoCount} Videos Loaded`,
      desc: 'Your local collection is stored safely in your browser storage with export/import support.',
      time: 'Today',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white dark:bg-[#0f0f0f] border-b border-neutral-200 dark:border-[#272727] select-none transition-colors">
      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#272727] text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 cursor-pointer group focus:outline-none"
        >
          {/* Authentic YouTube Icon SVG */}
          <div className="relative flex items-center justify-center">
            <svg
              className="w-7 h-5"
              viewBox="0 0 28 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="20" rx="6" fill="#FF0000" />
              <polygon points="11,6 19,10 11,14" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white flex items-center font-['Roboto',sans-serif]">
            YouLibrary
            <span className="ml-1 text-[9px] font-semibold text-neutral-500 uppercase tracking-wider relative -top-1.5">
              PRO
            </span>
          </span>
        </button>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-2xl mx-4 hidden sm:flex items-center justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(e);
          }}
          className="flex items-center w-full max-w-xl"
        >
          <div className="relative flex items-center flex-1 bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-[#303030] rounded-l-full overflow-hidden focus-within:border-blue-500 transition-all">
            <div className="pl-4 pr-1 text-neutral-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search your library, channels, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-2 px-2 text-sm bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1.5 mr-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            title="Search"
            className="h-10 px-6 bg-neutral-100 dark:bg-[#222222] hover:bg-neutral-200 dark:hover:bg-[#272727] border border-l-0 border-neutral-300 dark:border-[#303030] rounded-r-full text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Voice Search Mic Button */}
          <button
            type="button"
            onClick={onOpenVoiceSearch}
            title="Search with your voice"
            className="ml-3 p-2.5 rounded-full bg-neutral-100 dark:bg-[#222222] hover:bg-neutral-200 dark:hover:bg-[#272727] text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right: Actions, Theme, Notifications, Avatar */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* "+ Create / Embed" Button */}
        <button
          onClick={onOpenAddVideo}
          className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-neutral-100 dark:bg-[#222222] hover:bg-neutral-200 dark:hover:bg-[#2f2f2f] text-neutral-900 dark:text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-red-600" />
          <span className="hidden md:inline">Embed Video</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#272727] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadNotifications(0);
            }}
            title="Notifications"
            className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#272727] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#212121] text-neutral-900 dark:text-white shadow-2xl border border-neutral-200 dark:border-white/10 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-white/10">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="text-xs text-neutral-500">{notifications.length} updates</span>
              </div>
              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {n.desc}
                    </p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="ml-1 w-8 h-8 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700 cursor-pointer focus:ring-2 focus:ring-red-500"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#212121] text-neutral-900 dark:text-white shadow-2xl border border-neutral-200 dark:border-white/10 p-2 z-50">
              <div className="flex items-center gap-3 p-2.5 pb-3 border-b border-neutral-200 dark:border-white/10">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">Video Curator</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{videoCount} videos in library</p>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAddVideo();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <Plus className="w-4 h-4 text-red-500" /> Embed YouTube Video
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenPlaylistModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <FolderPlus className="w-4 h-4 text-blue-400" /> Manage Playlists
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenBackupModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Export / Import Library
                </button>
              </div>

              <div className="pt-1 border-t border-neutral-200 dark:border-white/10">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                  <span>Go to YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
