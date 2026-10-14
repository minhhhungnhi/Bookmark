import React, { useState, useEffect } from 'react';
import { X, Youtube, Sparkles, Check, AlertCircle, Film, Clock, User, Tag, Folder } from 'lucide-react';
import { Video, Playlist } from '../types/video';
import { extractYouTubeId, getYouTubeThumbnail, fetchYouTubeOEmbed } from '../utils/youtube';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: Video, playlistId?: string) => void;
  playlists: Playlist[];
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  onAddVideo,
  playlists,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [category, setCategory] = useState('Tech');
  const [duration, setDuration] = useState('10:00');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  // When URL input changes, attempt to parse video ID
  useEffect(() => {
    if (!urlInput.trim()) {
      setVideoId(null);
      setThumbnailUrl('');
      return;
    }

    const id = extractYouTubeId(urlInput);
    if (id) {
      setVideoId(id);
      setThumbnailUrl(getYouTubeThumbnail(id, 'hq'));
      setFetchError('');
      // Auto-fetch metadata if title is empty
      handleFetchMetadata(id);
    } else {
      setVideoId(null);
      setThumbnailUrl('');
    }
  }, [urlInput]);

  const handleFetchMetadata = async (idToFetch: string) => {
    setIsFetchingMetadata(true);
    setFetchError('');
    try {
      const data = await fetchYouTubeOEmbed(idToFetch);
      if (data) {
        if (data.title && !title) {
          setTitle(data.title);
        }
        if (data.author_name && !channelTitle) {
          setChannelTitle(data.author_name);
        }
        if (data.thumbnail_url) {
          setThumbnailUrl(data.thumbnail_url);
        }
      }
    } catch {
      // Non-blocking
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId) {
      setFetchError('Please provide a valid YouTube URL or 11-character video ID.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newVideo: Video = {
      id: videoId,
      title: title.trim() || `YouTube Video (${videoId})`,
      channelTitle: channelTitle.trim() || 'YouTube Creator',
      channelAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channelTitle || 'YT')}`,
      channelSubscribers: 'Curated Channel',
      verified: true,
      category,
      tags: tags.length > 0 ? tags : [category],
      duration: duration.trim() || '10:00',
      viewCount: 'Added to Library',
      publishedAt: 'Recently',
      addedAt: Date.now(),
      isLiked: false,
      isWatchLater: false,
      isFavorite,
      description: description.trim() || `Embedded YouTube video: https://www.youtube.com/watch?v=${videoId}`,
    };

    onAddVideo(newVideo, selectedPlaylistId || undefined);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setUrlInput('');
    setVideoId(null);
    setTitle('');
    setChannelTitle('');
    setCategory('Tech');
    setDuration('10:00');
    setDescription('');
    setTagsInput('');
    setSelectedPlaylistId('');
    setIsFavorite(false);
    setFetchError('');
  };

  if (!isOpen) return null;

  const categories = [
    'Tech',
    'Coding',
    'Music',
    'Science',
    'Gaming',
    'Podcasts',
    'Documentaries',
    'Design',
    'Education',
    'Entertainment',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#212121] text-white p-6 shadow-2xl border border-white/10 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-md">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Embed YouTube Video</h2>
              <p className="text-xs text-neutral-400">Add any video to your personal YouTube library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* YouTube URL Input */}
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              YouTube URL or Video ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                placeholder="https://www.youtube.com/watch?v=... or youtu.be/... or ID"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 pr-24"
              />
              {videoId && (
                <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-xs text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span className="font-mono">{videoId}</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Supports standard YouTube URLs, Shorts, mobile links, youtu.be links, and raw 11-char IDs.
            </p>
          </div>

          {/* Live Thumbnail & Quick Preview */}
          {videoId && (
            <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                <img
                  src={thumbnailUrl || getYouTubeThumbnail(videoId, 'hq')}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to default quality if maxres fails
                    (e.target as HTMLImageElement).src = getYouTubeThumbnail(videoId, 'mq');
                  }}
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded font-mono font-medium">
                  {duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400">Valid Video Detected</span>
                  {isFetchingMetadata && (
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-spin text-amber-400" /> Auto-fetching details...
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-white truncate mt-1">
                  {title || 'Loading title...'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Channel: {channelTitle || 'Auto-detected on paste'}
                </p>
              </div>
            </div>
          )}

          {fetchError && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {/* Video Title & Channel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">
                Channel / Creator Name
              </label>
              <input
                type="text"
                placeholder="e.g. Veritasium, Fireship, NPR Music"
                value={channelTitle}
                onChange={(e) => setChannelTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Category, Duration & Playlist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Duration (MM:SS)</label>
              <input
                type="text"
                placeholder="e.g. 14:20 or Live"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Add to Playlist</label>
              <select
                value={selectedPlaylistId}
                onChange={(e) => setSelectedPlaylistId(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="">None (Library only)</option>
                {playlists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. NextJS, React, Tutorial, Fullstack"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Description / Notes */}
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">
              Description & Key Notes (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Key concepts, timestamps, why this is one of your favorites..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded accent-red-600 cursor-pointer"
              />
              Mark as Favorite video (shows in Favorites tab)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!videoId}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-600 text-sm font-medium text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Youtube className="w-4 h-4" />
              Embed Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
