import React, { useState } from 'react';
import { History, Trash2, Search, ArrowLeft } from 'lucide-react';
import { Video, HistoryItem } from '../types/video';
import { VideoCard } from './VideoCard';
import { formatTimeAgo } from '../utils/youtube';

interface HistoryViewProps {
  history: HistoryItem[];
  videos: Video[];
  onPlay: (video: Video) => void;
  onClearHistory: () => void;
  onToggleWatchLater: (videoId: string) => void;
  onToggleFavorite: (videoId: string) => void;
  onOpenPlaylistModal: (video: Video) => void;
  onOpenShareModal: (video: Video) => void;
  onDeleteVideo: (videoId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  videos,
  onPlay,
  onClearHistory,
  onToggleWatchLater,
  onToggleFavorite,
  onOpenPlaylistModal,
  onOpenShareModal,
  onDeleteVideo,
}) => {
  const [historySearch, setHistorySearch] = useState('');

  // Map history items to video objects
  const historyVideosWithTime = history
    .map((item) => {
      const vid = videos.find((v) => v.id === item.videoId);
      return vid ? { video: vid, watchedAt: item.watchedAt } : null;
    })
    .filter(Boolean) as { video: Video; watchedAt: number }[];

  const filtered = historyVideosWithTime.filter((item) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      item.video.title.toLowerCase().includes(q) ||
      item.video.channelTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-[#272727]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-[#272727] flex items-center justify-center">
            <History className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Watch History</h1>
            <p className="text-xs text-neutral-500">
              {history.length} {history.length === 1 ? 'video' : 'videos'} watched
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* History Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search watch history"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-[#212121] border border-neutral-300 dark:border-white/10 rounded-full text-neutral-900 dark:text-white focus:outline-none focus:border-red-500 w-52"
            />
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all watch history?')) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <History className="w-12 h-12 text-neutral-400 mx-auto mb-3 opacity-50" />
          <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
            No watch history found
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Videos you play from your library will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-6">
          {filtered.map((item, idx) => (
            <div key={`${item.video.id}-${idx}`} className="flex flex-col">
              <span className="text-[10px] text-neutral-400 mb-1.5 font-medium">
                Watched {formatTimeAgo(item.watchedAt)}
              </span>
              <VideoCard
                video={item.video}
                onPlay={onPlay}
                onToggleWatchLater={onToggleWatchLater}
                onToggleFavorite={onToggleFavorite}
                onOpenPlaylistModal={onOpenPlaylistModal}
                onOpenShareModal={onOpenShareModal}
                onDeleteVideo={onDeleteVideo}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
