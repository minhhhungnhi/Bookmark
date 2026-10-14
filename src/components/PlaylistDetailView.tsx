import React from 'react';
import {
  Play,
  Shuffle,
  Trash2,
  Folder,
  ArrowLeft,
  Clock,
  MoreVertical,
  Share2,
} from 'lucide-react';
import { Video, Playlist } from '../types/video';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  videos: Video[];
  onBack: () => void;
  onPlay: (video: Video) => void;
  onRemoveFromPlaylist: (playlistId: string, videoId: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  videos,
  onBack,
  onPlay,
  onRemoveFromPlaylist,
  onDeletePlaylist,
}) => {
  const playlistVideos = playlist.videoIds
    .map((id) => videos.find((v) => v.id === id))
    .filter(Boolean) as Video[];

  const firstVideo = playlistVideos[0];

  const handlePlayAll = () => {
    if (playlistVideos.length > 0) {
      onPlay(playlistVideos[0]);
    }
  };

  const handleShufflePlay = () => {
    if (playlistVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlistVideos.length);
      onPlay(playlistVideos[randomIndex]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Playlists</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sticky Banner */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 p-6 rounded-3xl bg-gradient-to-b from-neutral-200 to-neutral-100 dark:from-[#212121] dark:to-[#171717] border border-neutral-300 dark:border-white/5 space-y-4">
            {/* Playlist Cover Art */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-xl">
              {firstVideo ? (
                <img
                  src={`https://img.youtube.com/vi/${firstVideo.id}/hqdefault.jpg`}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-500">
                  <Folder className="w-12 h-12" />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
                {playlist.title}
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                {playlist.description || 'Custom user curated playlist'}
              </p>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mt-3 font-medium">
                <span>{playlistVideos.length} videos</span>
                <span>·</span>
                <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Play & Shuffle buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePlayAll}
                disabled={playlistVideos.length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white dark:bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play all</span>
              </button>

              <button
                onClick={handleShufflePlay}
                disabled={playlistVideos.length === 0}
                className="flex items-center justify-center p-2.5 rounded-full bg-neutral-300 dark:bg-white/10 text-neutral-900 dark:text-white hover:bg-neutral-400 dark:hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-50"
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete playlist "${playlist.title}"?`)) {
                    onDeletePlaylist(playlist.id);
                  }
                }}
                className="flex items-center justify-center p-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                title="Delete Playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Videos List */}
        <div className="lg:col-span-8 space-y-2">
          {playlistVideos.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 dark:bg-[#181818] rounded-2xl border border-dashed border-neutral-300 dark:border-white/10 p-6">
              <Folder className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                This playlist has no videos yet
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Browse videos and click the bookmark/save icon to add videos to this playlist.
              </p>
            </div>
          ) : (
            playlistVideos.map((video, index) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] group transition-colors cursor-pointer"
                onClick={() => onPlay(video)}
              >
                <span className="w-6 text-center text-xs font-medium text-neutral-400">
                  {index + 1}
                </span>

                {/* Thumbnail */}
                <div className="relative w-36 aspect-video rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] font-mono text-white px-1 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-500">
                    {video.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">{video.channelTitle}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromPlaylist(playlist.id, video.id);
                    }}
                    title="Remove from playlist"
                    className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
