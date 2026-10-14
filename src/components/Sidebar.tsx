import React from 'react';
import {
  Home,
  Tv,
  Folder,
  History,
  Clock,
  ThumbsUp,
  Heart,
  Plus,
  Flame,
  Code,
  Music,
  Atom,
  Gamepad2,
  Radio,
  Download,
  ListVideo,
  ChevronRight,
} from 'lucide-react';
import { ActiveView, Playlist } from '../types/video';

interface SidebarProps {
  isExpanded: boolean;
  activeView: ActiveView;
  selectedPlaylistId: string | null;
  selectedCategory: string;
  playlists: Playlist[];
  onSelectView: (view: ActiveView, playlistId?: string) => void;
  onSelectCategory: (category: string) => void;
  onOpenPlaylistModal: () => void;
  onOpenBackupModal: () => void;
  likedCount: number;
  watchLaterCount: number;
  favoritesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  activeView,
  selectedPlaylistId,
  selectedCategory,
  playlists,
  onSelectView,
  onSelectCategory,
  onOpenPlaylistModal,
  onOpenBackupModal,
  likedCount,
  watchLaterCount,
  favoritesCount,
}) => {
  // Collapsed Mini Sidebar (YouTube 72px width)
  if (!isExpanded) {
    return (
      <aside className="w-18 shrink-0 flex flex-col items-center py-3 space-y-1 bg-white dark:bg-[#0f0f0f] border-r border-neutral-200 dark:border-[#272727] select-none transition-colors">
        <button
          onClick={() => {
            onSelectCategory('All');
            onSelectView('home');
          }}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            activeView === 'home' && selectedCategory === 'All'
              ? 'text-red-600 dark:text-white bg-neutral-100 dark:bg-[#272727]'
              : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectView('subscriptions')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            activeView === 'subscriptions'
              ? 'text-red-600 dark:text-white bg-neutral-100 dark:bg-[#272727]'
              : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Tv className="w-5 h-5 mb-1" />
          <span>Channels</span>
        </button>

        <button
          onClick={() => onSelectView('library')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            activeView === 'library'
              ? 'text-red-600 dark:text-white bg-neutral-100 dark:bg-[#272727]'
              : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Folder className="w-5 h-5 mb-1" />
          <span>Library</span>
        </button>

        <button
          onClick={() => onSelectView('history')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            activeView === 'history'
              ? 'text-red-600 dark:text-white bg-neutral-100 dark:bg-[#272727]'
              : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <History className="w-5 h-5 mb-1" />
          <span>History</span>
        </button>

        <button
          onClick={() => onSelectView('liked')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            activeView === 'liked'
              ? 'text-red-600 dark:text-white bg-neutral-100 dark:bg-[#272727]'
              : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <ThumbsUp className="w-5 h-5 mb-1" />
          <span>Liked</span>
        </button>
      </aside>
    );
  }

  // Expanded Sidebar (YouTube 240px width)
  return (
    <aside className="w-60 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto px-3 py-3 bg-white dark:bg-[#0f0f0f] border-r border-neutral-200 dark:border-[#272727] select-none transition-colors">
      {/* Primary Links */}
      <div className="space-y-1 pb-3 border-b border-neutral-200 dark:border-[#272727]">
        <button
          onClick={() => {
            onSelectCategory('All');
            onSelectView('home');
          }}
          className={`w-full flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeView === 'home' && selectedCategory === 'All'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectView('subscriptions')}
          className={`w-full flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeView === 'subscriptions'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Tv className="w-5 h-5" />
          <span>Subscriptions</span>
        </button>
      </div>

      {/* "You" Section */}
      <div className="py-3 border-b border-neutral-200 dark:border-[#272727] space-y-1">
        <button
          onClick={() => onSelectView('library')}
          className="w-full flex items-center justify-between px-3 py-1.5 text-sm font-semibold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-[#222222] rounded-lg transition-colors cursor-pointer group"
        >
          <span>You</span>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => onSelectView('library')}
          className={`w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeView === 'library'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Folder className="w-5 h-5" />
          <span>Library</span>
        </button>

        <button
          onClick={() => onSelectView('history')}
          className={`w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeView === 'history'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </button>

        <button
          onClick={() => onSelectView('watch-later')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeView === 'watch-later'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <div className="flex items-center gap-5">
            <Clock className="w-5 h-5" />
            <span>Watch Later</span>
          </div>
          {watchLaterCount > 0 && (
            <span className="text-xs text-neutral-500 font-normal">{watchLaterCount}</span>
          )}
        </button>

        <button
          onClick={() => onSelectView('liked')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeView === 'liked'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <div className="flex items-center gap-5">
            <ThumbsUp className="w-5 h-5" />
            <span>Liked videos</span>
          </div>
          {likedCount > 0 && (
            <span className="text-xs text-neutral-500 font-normal">{likedCount}</span>
          )}
        </button>

        <button
          onClick={() => onSelectView('favorites')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeView === 'favorites'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <div className="flex items-center gap-5">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Favorites</span>
          </div>
          {favoritesCount > 0 && (
            <span className="text-xs text-neutral-500 font-normal">{favoritesCount}</span>
          )}
        </button>
      </div>

      {/* Playlists Section */}
      <div className="py-3 border-b border-neutral-200 dark:border-[#272727] space-y-1">
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Playlists
          </span>
          <button
            onClick={onOpenPlaylistModal}
            title="Create new playlist"
            className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-[#272727] text-neutral-500 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {playlists.map((pl) => (
          <button
            key={pl.id}
            onClick={() => onSelectView('playlist', pl.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
              activeView === 'playlist' && selectedPlaylistId === pl.id
                ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <ListVideo className="w-5 h-5 shrink-0 text-neutral-400" />
              <span className="truncate">{pl.title}</span>
            </div>
            <span className="text-xs text-neutral-500 shrink-0 ml-2">{pl.videoIds.length}</span>
          </button>
        ))}
      </div>

      {/* Explore / Categories */}
      <div className="py-3 border-b border-neutral-200 dark:border-[#272727] space-y-1">
        <div className="px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Explore
        </div>

        <button
          onClick={() => {
            onSelectCategory('Coding');
            onSelectView('home');
          }}
          className={`w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === 'Coding' && activeView === 'home'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Code className="w-5 h-5 text-indigo-400" />
          <span>Coding & Tech</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory('Music');
            onSelectView('home');
          }}
          className={`w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === 'Music' && activeView === 'home'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Music className="w-5 h-5 text-rose-400" />
          <span>Music & Lofi</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory('Science');
            onSelectView('home');
          }}
          className={`w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === 'Science' && activeView === 'home'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Atom className="w-5 h-5 text-cyan-400" />
          <span>Science & Math</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory('Gaming');
            onSelectView('home');
          }}
          className={`w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === 'Gaming' && activeView === 'home'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Gamepad2 className="w-5 h-5 text-emerald-400" />
          <span>Gaming</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory('Podcasts');
            onSelectView('home');
          }}
          className={`w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === 'Podcasts' && activeView === 'home'
              ? 'bg-neutral-100 dark:bg-[#272727] font-semibold text-neutral-900 dark:text-white'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222]'
          }`}
        >
          <Radio className="w-5 h-5 text-amber-400" />
          <span>Podcasts</span>
        </button>
      </div>

      {/* Data Management Link */}
      <div className="py-3 border-b border-neutral-200 dark:border-[#272727]">
        <button
          onClick={onOpenBackupModal}
          className="w-full flex items-center gap-5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222222] transition-colors cursor-pointer"
        >
          <Download className="w-5 h-5 text-neutral-400" />
          <span>Backup & Restore</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="pt-4 px-3 text-[11px] text-neutral-400 dark:text-neutral-500 space-y-2">
        <p>YouLibrary · YouTube Embed Library</p>
        <p className="text-[10px]">© 2026 YouTube Library Engine. Powered by YouTube Embedded Player API.</p>
      </div>
    </aside>
  );
};
