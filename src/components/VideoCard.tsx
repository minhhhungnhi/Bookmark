import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Clock,
  FolderPlus,
  Heart,
  Share2,
  Trash2,
  CheckCircle2,
  Play,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Video } from '../types/video';
import { getYouTubeThumbnail } from '../utils/youtube';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onToggleWatchLater: (videoId: string) => void;
  onToggleFavorite: (videoId: string) => void;
  onOpenPlaylistModal: (video: Video) => void;
  onOpenShareModal: (video: Video) => void;
  onDeleteVideo: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onToggleWatchLater,
  onToggleFavorite,
  onOpenPlaylistModal,
  onOpenShareModal,
  onDeleteVideo,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    video.customThumbnailUrl || getYouTubeThumbnail(video.id, 'hq')
  );
  const [isCopied, setIsCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://youtu.be/${video.id}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      setShowMenu(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col group cursor-pointer select-none">
      {/* Thumbnail Container */}
      <div
        onClick={() => onPlay(video)}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 group-hover:rounded-none transition-all duration-300"
      >
        <img
          src={imgSrc}
          alt={video.title}
          onError={() => {
            // Fallback from hqdefault to mqdefault or standard default
            setImgSrc(getYouTubeThumbnail(video.id, 'mq'));
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-xs scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/85 text-white font-mono text-xs px-1.5 py-0.5 rounded font-medium shadow-md">
          {video.duration}
        </div>

        {/* Favorite Heart Badge if marked */}
        {video.isFavorite && (
          <div className="absolute top-2 left-2 bg-rose-600/90 text-white p-1 rounded-md shadow-md">
            <Heart className="w-3.5 h-3.5 fill-white" />
          </div>
        )}

        {/* Quick Action Buttons on Hover */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchLater(video.id);
            }}
            title={video.isWatchLater ? 'Remove from Watch Later' : 'Watch Later'}
            className={`p-1.5 rounded bg-black/80 hover:bg-black text-white backdrop-blur-xs shadow-md transition-colors cursor-pointer ${
              video.isWatchLater ? 'text-amber-400' : ''
            }`}
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPlaylistModal(video);
            }}
            title="Add to Playlist"
            className="p-1.5 rounded bg-black/80 hover:bg-black text-white backdrop-blur-xs shadow-md transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta Information Row */}
      <div className="flex items-start gap-3 mt-3 px-0.5">
        {/* Channel Avatar */}
        <div
          onClick={() => onPlay(video)}
          className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-neutral-800 border border-neutral-700/50"
        >
          <img
            src={
              video.channelAvatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(video.channelTitle)}`
            }
            alt={video.channelTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Metadata */}
        <div className="flex-1 min-w-0" onClick={() => onPlay(video)}>
          <h3
            className="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-neutral-900 dark:group-hover:text-white leading-snug tracking-tight"
            title={video.title}
          >
            {video.title}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="truncate hover:text-neutral-900 dark:hover:text-neutral-200">{video.channelTitle}</span>
            {video.verified && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 fill-neutral-500 text-white dark:text-[#0f0f0f]" />}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            <span>{video.viewCount}</span>
            <span aria-hidden="true">·</span>
            <span>{video.publishedAt}</span>
          </div>
        </div>

        {/* 3-dots Menu Button */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-[#272727] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
            aria-label="Action menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-52 rounded-xl bg-white dark:bg-[#282828] text-neutral-800 dark:text-neutral-200 shadow-2xl border border-neutral-200 dark:border-white/10 p-1.5 z-40 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchLater(video.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>{video.isWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlaylistModal(video);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Save to Playlist</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(video.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${video.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{video.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShareModal(video);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share & Embed code</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyLink();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <ExternalLink className="w-4 h-4" />}
                <span>{isCopied ? 'Link Copied!' : 'Copy YouTube URL'}</span>
              </button>

              <div className="my-1 border-t border-neutral-200 dark:border-white/10" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Remove "${video.title}" from your library?`)) {
                    onDeleteVideo(video.id);
                  }
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400 text-left transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove from library</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
