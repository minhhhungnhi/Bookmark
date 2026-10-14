import React from 'react';
import {
  Folder,
  History,
  Clock,
  ThumbsUp,
  Heart,
  ListVideo,
  Plus,
  ArrowRight,
  Download,
  Film,
} from 'lucide-react';
import { Video, Playlist, HistoryItem, ActiveView } from '../types/video';
import { VideoCard } from './VideoCard';

interface LibraryViewProps {
  videos: Video[];
  playlists: Playlist[];
  history: HistoryItem[];
  onPlay: (video: Video) => void;
  onSelectView: (view: ActiveView, playlistId?: string) => void;
  onOpenAddVideo: () => void;
  onOpenPlaylistModal: (video?: Video) => void;
  onOpenBackupModal: () => void;
  onToggleWatchLater: (videoId: string) => void;
  onToggleFavorite: (videoId: string) => void;
  onOpenShareModal: (video: Video) => void;
  onDeleteVideo: (videoId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  videos,
  playlists,
  history,
  onPlay,
  onSelectView,
  onOpenAddVideo,
  onOpenPlaylistModal,
  onOpenBackupModal,
  onToggleWatchLater,
  onToggleFavorite,
  onOpenShareModal,
  onDeleteVideo,
}) => {
  const likedVideos = videos.filter((v) => v.isLiked);
  const watchLaterVideos = videos.filter((v) => v.isWatchLater);
  const favoriteVideos = videos.filter((v) => v.isFavorite);

  // History videos (most recent 4)
  const recentHistoryVideos = history
    .slice(0, 4)
    .map((h) => videos.find((v) => v.id === h.videoId))
    .filter(Boolean) as Video[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* Profile & Overview Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-100 dark:bg-[#1f1f1f] border border-neutral-200 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-800 border-2 border-red-600">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Your YouTube Library</h1>
            <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{videos.length} Embedded Videos</span>
              <span>·</span>
              <span>{playlists.length} Playlists</span>
              <span>·</span>
              <span>{likedVideos.length} Liked</span>
              <span>·</span>
              <span>{favoriteVideos.length} Favorites</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddVideo}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Embed Video
          </button>
          <button
            onClick={onOpenBackupModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Backup
          </button>
        </div>
      </div>

      {/* History Tray */}
      {recentHistoryVideos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#272727]">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">History</h2>
            </div>
            <button
              onClick={() => onSelectView('history')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-400 cursor-pointer"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentHistoryVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={onPlay}
                onToggleWatchLater={onToggleWatchLater}
                onToggleFavorite={onToggleFavorite}
                onOpenPlaylistModal={onOpenPlaylistModal}
                onOpenShareModal={onOpenShareModal}
                onDeleteVideo={onDeleteVideo}
              />
            ))}
          </div>
        </section>
      )}

      {/* Watch Later Tray */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#272727]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Watch Later</h2>
            <span className="text-xs text-neutral-400">({watchLaterVideos.length})</span>
          </div>
          <button
            onClick={() => onSelectView('watch-later')}
            className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-400 cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {watchLaterVideos.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-2">
            No videos in Watch Later. Click the clock icon on any video to add it.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {watchLaterVideos.slice(0, 4).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={onPlay}
                onToggleWatchLater={onToggleWatchLater}
                onToggleFavorite={onToggleFavorite}
                onOpenPlaylistModal={onOpenPlaylistModal}
                onOpenShareModal={onOpenShareModal}
                onDeleteVideo={onDeleteVideo}
              />
            ))}
          </div>
        )}
      </section>

      {/* Liked Videos Tray */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#272727]">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Liked Videos</h2>
            <span className="text-xs text-neutral-400">({likedVideos.length})</span>
          </div>
          <button
            onClick={() => onSelectView('liked')}
            className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-400 cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {likedVideos.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-2">
            No liked videos yet. Like videos while watching to save them here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {likedVideos.slice(0, 4).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={onPlay}
                onToggleWatchLater={onToggleWatchLater}
                onToggleFavorite={onToggleFavorite}
                onOpenPlaylistModal={onOpenPlaylistModal}
                onOpenShareModal={onOpenShareModal}
                onDeleteVideo={onDeleteVideo}
              />
            ))}
          </div>
        )}
      </section>

      {/* Playlists Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#272727]">
          <div className="flex items-center gap-2">
            <ListVideo className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Playlists</h2>
            <span className="text-xs text-neutral-400">({playlists.length})</span>
          </div>
          <button
            onClick={() => onOpenPlaylistModal()}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:text-red-500 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New playlist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((pl) => {
            const coverVideo = videos.find((v) => v.id === (pl.coverVideoId || pl.videoIds[0]));
            return (
              <div
                key={pl.id}
                onClick={() => onSelectView('playlist', pl.id)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#1f1f1f] border border-neutral-200 dark:border-white/5 hover:border-neutral-400 dark:hover:border-white/20 transition-all p-3"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3">
                  {coverVideo ? (
                    <img
                      src={`https://img.youtube.com/vi/${coverVideo.id}/hqdefault.jpg`}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-500">
                      <ListVideo className="w-8 h-8" />
                    </div>
                  )}
                  {/* Playlist Badge Overlay */}
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                    <ListVideo className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">{pl.videoIds.length}</span>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400">videos</span>
                  </div>
                </div>

                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                  {pl.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                  {pl.description || 'Custom playlist'}
                </p>
                <span className="text-[11px] text-blue-500 font-semibold mt-2 inline-block">
                  View full playlist
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
