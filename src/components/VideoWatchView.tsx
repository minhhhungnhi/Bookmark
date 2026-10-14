import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  FolderPlus,
  Heart,
  MoreVertical,
  CheckCircle2,
  Check,
  Maximize2,
  Minimize2,
  BookOpen,
  Send,
  Trash2,
  Clock,
  Play,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Video, VideoNote, VideoComment } from '../types/video';
import { getYouTubeEmbedUrl, parseSeconds, formatTimeAgo } from '../utils/youtube';

interface VideoWatchViewProps {
  video: Video;
  allVideos: Video[];
  onBack: () => void;
  onSelectVideo: (video: Video) => void;
  onToggleLike: (videoId: string) => void;
  onToggleFavorite: (videoId: string) => void;
  onToggleWatchLater: (videoId: string) => void;
  onOpenPlaylistModal: (video: Video) => void;
  onOpenShareModal: (video: Video) => void;
  onDeleteVideo: (videoId: string) => void;
  onAddNote: (videoId: string, note: { timestampSeconds?: number; timestampLabel?: string; text: string }) => void;
  onDeleteNote: (videoId: string, noteId: string) => void;
  onAddComment: (videoId: string, commentText: string) => void;
}

export const VideoWatchView: React.FC<VideoWatchViewProps> = ({
  video,
  allVideos,
  onBack,
  onSelectVideo,
  onToggleLike,
  onToggleFavorite,
  onToggleWatchLater,
  onOpenPlaylistModal,
  onOpenShareModal,
  onDeleteVideo,
  onAddNote,
  onDeleteNote,
  onAddComment,
}) => {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [seekSeconds, setSeekSeconds] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'comments' | 'notes'>('comments');

  // New Note state
  const [noteText, setNoteText] = useState('');
  const [noteTimestamp, setNoteTimestamp] = useState('');

  // New Comment state
  const [commentInput, setCommentInput] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // Up Next / Related videos
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'channel' | 'category'>('all');
  const [autoplay, setAutoplay] = useState(true);

  const relatedVideos = allVideos
    .filter((v) => v.id !== video.id)
    .filter((v) => {
      if (sidebarFilter === 'channel') return v.channelTitle === video.channelTitle;
      if (sidebarFilter === 'category') return v.category === video.category;
      return true;
    });

  const handleSeek = (timeStr: string) => {
    const secs = parseSeconds(timeStr);
    setSeekSeconds(secs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const secs = noteTimestamp.trim() ? parseSeconds(noteTimestamp.trim()) : undefined;
    onAddNote(video.id, {
      text: noteText.trim(),
      timestampLabel: noteTimestamp.trim() || undefined,
      timestampSeconds: secs,
    });
    setNoteText('');
    setNoteTimestamp('');
  };

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(video.id, commentInput.trim());
    setCommentInput('');
    setIsCommenting(false);
  };

  // Convert timestamps in description into clickable spans
  const renderDescriptionContent = (text: string) => {
    const timestampRegex = /(\b\d{1,2}:\d{2}(?::\d{2})?\b)/g;
    const parts = text.split(timestampRegex);

    return parts.map((part, i) => {
      if (timestampRegex.test(part)) {
        return (
          <button
            key={i}
            onClick={() => handleSeek(part)}
            className="text-blue-500 hover:text-blue-400 font-mono font-medium hover:underline inline-block px-1 cursor-pointer"
          >
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0f0f0f] text-neutral-900 dark:text-[#f1f1f1] transition-colors pb-16">
      {/* Top back navigation bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-[#272727]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            title={isTheaterMode ? 'Default view' : 'Theater mode'}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isTheaterMode ? 'Exit Theater' : 'Theater mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Watch Layout Container */}
      <div
        className={`mx-auto px-4 pt-4 transition-all ${
          isTheaterMode ? 'max-w-[1800px]' : 'max-w-[1400px]'
        }`}
      >
        <div className={`grid grid-cols-1 ${isTheaterMode ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
          {/* Main Video & Details Column */}
          <div className={isTheaterMode ? 'lg:col-span-1' : 'lg:col-span-2'}>
            {/* Embedded YouTube Player */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-200 dark:border-white/5">
              <iframe
                key={`${video.id}-${seekSeconds}`}
                src={getYouTubeEmbedUrl(video.id, true, seekSeconds)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Title */}
            <h1 className="text-xl sm:text-2xl font-bold mt-4 leading-snug">
              {video.title}
            </h1>

            {/* Channel Info & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pb-3 border-b border-neutral-200 dark:border-[#272727]">
              {/* Channel Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 shrink-0">
                  <img
                    src={
                      video.channelAvatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(video.channelTitle)}`
                    }
                    alt={video.channelTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-semibold text-sm sm:text-base">
                    <span>{video.channelTitle}</span>
                    {video.verified && (
                      <CheckCircle2 className="w-4 h-4 fill-neutral-500 text-white dark:text-[#0f0f0f]" />
                    )}
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                    {video.channelSubscribers || 'Curated Channel'}
                  </span>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`ml-3 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isSubscribed
                      ? 'bg-neutral-200 dark:bg-[#272727] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-[#383838]'
                      : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Segmented Like/Dislike Button */}
                <div className="flex items-center bg-neutral-100 dark:bg-[#272727] rounded-full overflow-hidden">
                  <button
                    onClick={() => {
                      onToggleLike(video.id);
                      if (isDisliked) setIsDisliked(false);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-[#383838] transition-colors cursor-pointer ${
                      video.isLiked ? 'text-red-600 dark:text-red-400 font-bold' : ''
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${video.isLiked ? 'fill-current' : ''}`} />
                    <span>{video.isLiked ? 'Liked' : 'Like'}</span>
                  </button>
                  <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700" />
                  <button
                    onClick={() => {
                      setIsDisliked(!isDisliked);
                      if (video.isLiked) onToggleLike(video.id);
                    }}
                    className={`px-3 py-2 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-[#383838] transition-colors cursor-pointer ${
                      isDisliked ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'
                    }`}
                    title="Dislike"
                  >
                    <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => onToggleFavorite(video.id)}
                  title="Favorite"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-100 dark:bg-[#272727] hover:bg-neutral-200 dark:hover:bg-[#383838] text-xs font-medium transition-colors cursor-pointer ${
                    video.isFavorite ? 'text-rose-500 font-bold' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${video.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="hidden sm:inline">Favorite</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => onOpenShareModal(video)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-100 dark:bg-[#272727] hover:bg-neutral-200 dark:hover:bg-[#383838] text-xs font-medium transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* Save to Playlist Button */}
                <button
                  onClick={() => onOpenPlaylistModal(video)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-100 dark:bg-[#272727] hover:bg-neutral-200 dark:hover:bg-[#383838] text-xs font-medium transition-colors cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </button>

                {/* Notes Tab Toggle */}
                <button
                  onClick={() => setActiveTab(activeTab === 'notes' ? 'comments' : 'notes')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'notes'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-[#272727] hover:bg-neutral-200 dark:hover:bg-[#383838]'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Notes {video.notes && video.notes.length > 0 ? `(${video.notes.length})` : ''}</span>
                </button>
              </div>
            </div>

            {/* Description Box */}
            <div className="mt-4 p-4 rounded-2xl bg-neutral-100 dark:bg-[#212121] text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-white/5 transition-all">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white mb-2">
                <span>{video.viewCount}</span>
                <span aria-hidden="true">·</span>
                <span>{video.publishedAt}</span>
                <span aria-hidden="true">·</span>
                <span className="text-blue-500 font-normal">
                  {video.tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ')}
                </span>
              </div>

              <div
                className={`whitespace-pre-wrap leading-relaxed ${
                  !descriptionExpanded ? 'line-clamp-3' : ''
                }`}
              >
                {renderDescriptionContent(video.description)}
              </div>

              <button
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                className="mt-2 text-xs font-semibold text-neutral-900 dark:text-white hover:underline cursor-pointer"
              >
                {descriptionExpanded ? 'Show less' : '...more'}
              </button>
            </div>

            {/* Tabbed Interactive Section: Comments & Personal Video Notes */}
            <div className="mt-6">
              {/* Tab Selector */}
              <div className="flex items-center gap-4 border-b border-neutral-200 dark:border-[#272727] pb-3">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`text-base font-semibold transition-colors cursor-pointer relative pb-1 ${
                    activeTab === 'comments'
                      ? 'text-neutral-900 dark:text-white after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  Comments ({video.comments?.length || 0})
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`text-base font-semibold transition-colors cursor-pointer relative pb-1 flex items-center gap-1.5 ${
                    activeTab === 'notes'
                      ? 'text-neutral-900 dark:text-white after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Personal Study Notes ({video.notes?.length || 0})
                </button>
              </div>

              {/* COMMENTS TAB */}
              {activeTab === 'comments' && (
                <div className="pt-4 space-y-6">
                  {/* Add Comment Input Form */}
                  <form onSubmit={handleCreateComment} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-300 dark:bg-neutral-800 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                        alt="Your avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Add a comment to this video..."
                        value={commentInput}
                        onFocus={() => setIsCommenting(true)}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full pb-1 text-sm bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                      />
                      {isCommenting && (
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCommenting(false);
                              setCommentInput('');
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!commentInput.trim()}
                            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-xs font-medium text-white transition-colors cursor-pointer"
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {(!video.comments || video.comments.length === 0) ? (
                      <p className="text-xs text-neutral-500 italic py-2">
                        No comments yet on this video in your library. Be the first to add one!
                      </p>
                    ) : (
                      video.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-800 shrink-0">
                            <img
                              src={comment.avatar}
                              alt={comment.author}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                                {comment.author}
                              </span>
                              <span className="text-[11px] text-neutral-500">{comment.time}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 mt-1">
                              {comment.text}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                              <button className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{comment.likes}</span>
                              </button>
                              <button className="hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                              <button className="text-[11px] font-medium hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* PERSONAL NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="pt-4 space-y-4">
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                    <p className="font-medium">Private Timestamped Video Notes</p>
                    <p className="text-neutral-400 mt-0.5">
                      Save key formulas, takeaways, and code snippets linked to video timestamps. Clicking the timestamp will seek right to that point.
                    </p>
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleCreateNote} className="p-3 rounded-xl bg-neutral-100 dark:bg-[#212121] border border-neutral-200 dark:border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Timestamp (e.g. 03:45)"
                        value={noteTimestamp}
                        onChange={(e) => setNoteTimestamp(e.target.value)}
                        className="w-32 bg-white dark:bg-black/40 border border-neutral-300 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs text-neutral-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-[11px] text-neutral-400">Optional video marker</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Write note or key insight..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="flex-1 bg-white dark:bg-black/40 border border-neutral-300 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!noteText.trim()}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Save
                      </button>
                    </div>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-2">
                    {(!video.notes || video.notes.length === 0) ? (
                      <p className="text-xs text-neutral-500 italic py-3 text-center">
                        No private notes yet for this video.
                      </p>
                    ) : (
                      video.notes.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-start justify-between p-3 rounded-xl bg-neutral-100 dark:bg-[#1f1f1f] border border-neutral-200 dark:border-white/5 group"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            {note.timestampLabel && (
                              <button
                                onClick={() => handleSeek(note.timestampLabel!)}
                                className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-blue-500 hover:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded mr-2 mb-1 cursor-pointer"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                {note.timestampLabel}
                              </button>
                            )}
                            <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                              {note.text}
                            </p>
                            <span className="text-[10px] text-neutral-500 mt-1 block">
                              {formatTimeAgo(note.createdAt)}
                            </span>
                          </div>

                          <button
                            onClick={() => onDeleteNote(video.id, note.id)}
                            className="p-1 text-neutral-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Up Next / Related Videos Sidebar */}
          <div className="space-y-4">
            {/* Autoplay & Filter bar */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#272727]">
              <span className="font-semibold text-sm">Up Next</span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 cursor-pointer">
                  <span>Autoplay</span>
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-red-600"
                  />
                </label>
              </div>
            </div>

            {/* Filter chips for Up Next */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSidebarFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  sidebarFilter === 'all'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-[#272727] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#383838]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSidebarFilter('category')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  sidebarFilter === 'category'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-[#272727] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#383838]'
                }`}
              >
                {video.category}
              </button>
              <button
                onClick={() => setSidebarFilter('channel')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors truncate max-w-[140px] ${
                  sidebarFilter === 'channel'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-[#272727] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#383838]'
                }`}
              >
                From {video.channelTitle}
              </button>
            </div>

            {/* Related Video Cards (Horizontal Compact format) */}
            <div className="space-y-3">
              {relatedVideos.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 text-center">
                  No other videos in this filter category yet.
                </p>
              ) : (
                relatedVideos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectVideo(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex gap-2.5 group cursor-pointer select-none rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 p-1 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] font-mono font-medium text-white px-1 py-0.5 rounded">
                        {item.duration}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h4
                        className="text-xs font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug group-hover:text-blue-500"
                        title={item.title}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 truncate">
                        {item.channelTitle}
                      </p>
                      <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <span>{item.viewCount}</span>
                        <span>·</span>
                        <span>{item.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
