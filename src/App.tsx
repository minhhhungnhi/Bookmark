/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CategoriesBar } from './components/CategoriesBar';
import { VideoCard } from './components/VideoCard';
import { VideoWatchView } from './components/VideoWatchView';
import { LibraryView } from './components/LibraryView';
import { HistoryView } from './components/HistoryView';
import { PlaylistDetailView } from './components/PlaylistDetailView';
import { ChannelsView } from './components/ChannelsView';
import { AddVideoModal } from './components/AddVideoModal';
import { PlaylistModal } from './components/PlaylistModal';
import { ShareModal } from './components/ShareModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { BackupModal } from './components/BackupModal';
import { storage } from './services/storage';
import { Video, Playlist, HistoryItem, ActiveView, VideoNote } from './types/video';
import { Plus, Search, Youtube, ThumbsUp, Heart, Clock, Folder } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => storage.getTheme());

  // Core Data state
  const [videos, setVideos] = useState<Video[]>(() => storage.getVideos());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => storage.getPlaylists());
  const [history, setHistory] = useState<HistoryItem[]>(() => storage.getHistory());

  // Navigation & View state
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  // Modals state
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] = useState<Video | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedVideoForShare, setSelectedVideoForShare] = useState<Video | null>(null);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.saveTheme(theme);
  }, [theme]);

  // Persist videos and playlists when they change
  useEffect(() => {
    storage.saveVideos(videos);
  }, [videos]);

  useEffect(() => {
    storage.savePlaylists(playlists);
  }, [playlists]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Play video handler
  const handlePlayVideo = (video: Video) => {
    setCurrentVideo(video);
    setActiveView('watch');
    storage.addToHistory(video.id);
    setHistory(storage.getHistory());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Like
  const handleToggleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isLiked: !v.isLiked } : v))
    );
    if (currentVideo && currentVideo.id === videoId) {
      setCurrentVideo((prev) => (prev ? { ...prev, isLiked: !prev.isLiked } : null));
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isFavorite: !v.isFavorite } : v))
    );
    if (currentVideo && currentVideo.id === videoId) {
      setCurrentVideo((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Toggle Watch Later
  const handleToggleWatchLater = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isWatchLater: !v.isWatchLater } : v))
    );
    if (currentVideo && currentVideo.id === videoId) {
      setCurrentVideo((prev) => (prev ? { ...prev, isWatchLater: !prev.isWatchLater } : null));
    }
  };

  // Add new video
  const handleAddVideo = (newVideo: Video, playlistId?: string) => {
    // Check if video already exists
    const exists = videos.some((v) => v.id === newVideo.id);
    if (exists) {
      setVideos((prev) => prev.map((v) => (v.id === newVideo.id ? newVideo : v)));
    } else {
      setVideos((prev) => [newVideo, ...prev]);
    }

    if (playlistId) {
      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId && !pl.videoIds.includes(newVideo.id)) {
            return { ...pl, videoIds: [...pl.videoIds, newVideo.id] };
          }
          return pl;
        })
      );
    }
  };

  // Delete video from library
  const handleDeleteVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    // Remove from playlists
    setPlaylists((prev) =>
      prev.map((pl) => ({
        ...pl,
        videoIds: pl.videoIds.filter((id) => id !== videoId),
      }))
    );
    if (currentVideo?.id === videoId) {
      setCurrentVideo(null);
      setActiveView('home');
    }
  };

  // Playlist management
  const handleCreatePlaylist = (title: string, description?: string): string => {
    const newId = `pl-${Date.now()}`;
    const newPlaylist: Playlist = {
      id: newId,
      title,
      description,
      videoIds: [],
      createdAt: Date.now(),
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    return newId;
  };

  const handleToggleVideoInPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          const has = pl.videoIds.includes(videoId);
          return {
            ...pl,
            videoIds: has ? pl.videoIds.filter((id) => id !== videoId) : [...pl.videoIds, videoId],
          };
        }
        return pl;
      })
    );
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      setActiveView('home');
    }
  };

  const handleRemoveFromPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? { ...pl, videoIds: pl.videoIds.filter((id) => id !== videoId) }
          : pl
      )
    );
  };

  // Notes on video
  const handleAddNote = (
    videoId: string,
    noteData: { timestampSeconds?: number; timestampLabel?: string; text: string }
  ) => {
    const newNote: VideoNote = {
      id: `n-${Date.now()}`,
      createdAt: Date.now(),
      ...noteData,
    };
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, notes: [newNote, ...(v.notes || [])] } : v))
    );
    if (currentVideo && currentVideo.id === videoId) {
      setCurrentVideo((prev) =>
        prev ? { ...prev, notes: [newNote, ...(prev.notes || [])] } : null
      );
    }
  };

  const handleDeleteNote = (videoId: string, noteId: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? { ...v, notes: (v.notes || []).filter((n) => n.id !== noteId) }
          : v
      )
    );
    if (currentVideo && currentVideo.id === videoId) {
      setCurrentVideo((prev) =>
        prev
          ? { ...prev, notes: (prev.notes || []).filter((n) => n.id !== noteId) }
          : null
      );
    }
  };

  // Comments on video
  const handleAddComment = (videoId: string, commentText: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You (Curator)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
      text: commentText,
      time: 'Just now',
      likes: 0,
    };
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId ? { ...v, comments: [newComment, ...(v.comments || [])] } : v
      )
    );
    if (currentVideo && currentVideo.id === videoId) {
      setCurrentVideo((prev) =>
        prev
          ? { ...prev, comments: [newComment, ...(prev.comments || [])] }
          : null
      );
    }
  };

  const handleClearHistory = () => {
    storage.clearHistory();
    setHistory([]);
  };

  const handleDataRestored = () => {
    setVideos(storage.getVideos());
    setPlaylists(storage.getPlaylists());
    setHistory(storage.getHistory());
  };

  // Available categories extracted from videos
  const availableCategories = useMemo(() => {
    const set = new Set(['All', 'Favorites', 'Recently Added']);
    videos.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set);
  }, [videos]);

  // Filtered videos based on active view and search query
  const displayedVideos = useMemo(() => {
    let list = [...videos];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channelTitle.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q)) ||
          v.description.toLowerCase().includes(q)
      );
    }

    // View specific filter
    if (activeView === 'liked') {
      list = list.filter((v) => v.isLiked);
    } else if (activeView === 'watch-later') {
      list = list.filter((v) => v.isWatchLater);
    } else if (activeView === 'favorites') {
      list = list.filter((v) => v.isFavorite);
    } else if (activeView === 'home') {
      // Category filter on Home
      if (selectedCategory === 'Favorites') {
        list = list.filter((v) => v.isFavorite);
      } else if (selectedCategory === 'Recently Added') {
        list.sort((a, b) => b.addedAt - a.addedAt);
      } else if (selectedCategory !== 'All') {
        list = list.filter((v) => v.category === selectedCategory);
      }
    }

    return list;
  }, [videos, activeView, selectedCategory, searchQuery]);

  const likedCount = useMemo(() => videos.filter((v) => v.isLiked).length, [videos]);
  const watchLaterCount = useMemo(() => videos.filter((v) => v.isWatchLater).length, [videos]);
  const favoritesCount = useMemo(() => videos.filter((v) => v.isFavorite).length, [videos]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-neutral-900 dark:text-white transition-colors flex flex-col font-['Roboto',sans-serif]">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => {
          if (activeView === 'watch') {
            setActiveView('home');
          }
        }}
        onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
        onOpenAddVideo={() => setIsAddVideoOpen(true)}
        onOpenPlaylistModal={() => {
          setSelectedVideoForPlaylist(null);
          setIsPlaylistModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onGoHome={() => {
          setActiveView('home');
          setSelectedCategory('All');
          setSearchQuery('');
        }}
        videoCount={videos.length}
      />

      <div className="flex flex-1">
        {/* Sidebar (not shown on Watch mode if theater or focused) */}
        {activeView !== 'watch' && (
          <Sidebar
            isExpanded={isSidebarExpanded}
            activeView={activeView}
            selectedPlaylistId={selectedPlaylistId}
            selectedCategory={selectedCategory}
            playlists={playlists}
            onSelectView={(view, plId) => {
              setActiveView(view);
              if (plId) setSelectedPlaylistId(plId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPlaylistModal={() => {
              setSelectedVideoForPlaylist(null);
              setIsPlaylistModalOpen(true);
            }}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            likedCount={likedCount}
            watchLaterCount={watchLaterCount}
            favoritesCount={favoritesCount}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          {/* WATCH VIEW */}
          {activeView === 'watch' && currentVideo && (
            <VideoWatchView
              video={currentVideo}
              allVideos={videos}
              onBack={() => setActiveView('home')}
              onSelectVideo={handlePlayVideo}
              onToggleLike={handleToggleLike}
              onToggleFavorite={handleToggleFavorite}
              onToggleWatchLater={handleToggleWatchLater}
              onOpenPlaylistModal={(v) => {
                setSelectedVideoForPlaylist(v);
                setIsPlaylistModalOpen(true);
              }}
              onOpenShareModal={(v) => {
                setSelectedVideoForShare(v);
                setIsShareModalOpen(true);
              }}
              onDeleteVideo={handleDeleteVideo}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onAddComment={handleAddComment}
            />
          )}

          {/* PLAYLIST DETAIL VIEW */}
          {activeView === 'playlist' && selectedPlaylistId && (
            (() => {
              const pl = playlists.find((p) => p.id === selectedPlaylistId);
              if (!pl) {
                return (
                  <div className="p-8 text-center text-neutral-400">
                    Playlist not found.
                  </div>
                );
              }
              return (
                <PlaylistDetailView
                  playlist={pl}
                  videos={videos}
                  onBack={() => setActiveView('library')}
                  onPlay={handlePlayVideo}
                  onRemoveFromPlaylist={handleRemoveFromPlaylist}
                  onDeletePlaylist={handleDeletePlaylist}
                />
              );
            })()
          )}

          {/* LIBRARY / "YOU" VIEW */}
          {activeView === 'library' && (
            <LibraryView
              videos={videos}
              playlists={playlists}
              history={history}
              onPlay={handlePlayVideo}
              onSelectView={(view, plId) => {
                setActiveView(view);
                if (plId) setSelectedPlaylistId(plId);
              }}
              onOpenAddVideo={() => setIsAddVideoOpen(true)}
              onOpenPlaylistModal={(v) => {
                setSelectedVideoForPlaylist(v || null);
                setIsPlaylistModalOpen(true);
              }}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
              onToggleWatchLater={handleToggleWatchLater}
              onToggleFavorite={handleToggleFavorite}
              onOpenShareModal={(v) => {
                setSelectedVideoForShare(v);
                setIsShareModalOpen(true);
              }}
              onDeleteVideo={handleDeleteVideo}
            />
          )}

          {/* HISTORY VIEW */}
          {activeView === 'history' && (
            <HistoryView
              history={history}
              videos={videos}
              onPlay={handlePlayVideo}
              onClearHistory={handleClearHistory}
              onToggleWatchLater={handleToggleWatchLater}
              onToggleFavorite={handleToggleFavorite}
              onOpenPlaylistModal={(v) => {
                setSelectedVideoForPlaylist(v);
                setIsPlaylistModalOpen(true);
              }}
              onOpenShareModal={(v) => {
                setSelectedVideoForShare(v);
                setIsShareModalOpen(true);
              }}
              onDeleteVideo={handleDeleteVideo}
            />
          )}

          {/* CHANNELS / SUBSCRIPTIONS VIEW */}
          {activeView === 'subscriptions' && (
            <ChannelsView
              videos={videos}
              onSelectChannel={(ch) => {
                setSearchQuery(ch);
                setActiveView('home');
              }}
            />
          )}

          {/* HOME / LIKED / WATCH LATER / FAVORITES GRID VIEWS */}
          {['home', 'liked', 'watch-later', 'favorites'].includes(activeView) && (
            <div className="flex flex-col min-h-screen">
              {/* Category chips on Home view */}
              {activeView === 'home' && !searchQuery && (
                <CategoriesBar
                  categories={availableCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              )}

              {/* View Header if filtered */}
              {activeView !== 'home' && (
                <div className="px-6 pt-6 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-[#272727]">
                  <div className="flex items-center gap-3">
                    {activeView === 'liked' && (
                      <div className="p-2.5 rounded-full bg-red-500/10 text-red-500">
                        <ThumbsUp className="w-5 h-5" />
                      </div>
                    )}
                    {activeView === 'watch-later' && (
                      <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-500">
                        <Clock className="w-5 h-5" />
                      </div>
                    )}
                    {activeView === 'favorites' && (
                      <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-500">
                        <Heart className="w-5 h-5 fill-current" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-xl font-bold">
                        {activeView === 'liked' && 'Liked Videos'}
                        {activeView === 'watch-later' && 'Watch Later'}
                        {activeView === 'favorites' && 'Favorite Videos'}
                      </h1>
                      <p className="text-xs text-neutral-500">
                        {displayedVideos.length} {displayedVideos.length === 1 ? 'video' : 'videos'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Search indicator */}
              {searchQuery && (
                <div className="px-6 pt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    Search results for &quot;<strong className="text-neutral-900 dark:text-white">{searchQuery}</strong>&quot; ({displayedVideos.length} videos)
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* Video Grid */}
              <div className="p-4 sm:p-6 flex-1">
                {displayedVideos.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-50 dark:bg-[#141414] rounded-2xl border border-dashed border-neutral-300 dark:border-white/10 max-w-xl mx-auto p-8">
                    <Youtube className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                      No videos found
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                      {searchQuery
                        ? `No videos matched "${searchQuery}". Try a different keyword.`
                        : 'Your library is empty in this view. Embed your favorite YouTube videos to build your collection!'}
                    </p>
                    <button
                      onClick={() => setIsAddVideoOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Embed YouTube Video
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                    {displayedVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onPlay={handlePlayVideo}
                        onToggleWatchLater={handleToggleWatchLater}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenPlaylistModal={(v) => {
                          setSelectedVideoForPlaylist(v);
                          setIsPlaylistModalOpen(true);
                        }}
                        onOpenShareModal={(v) => {
                          setSelectedVideoForShare(v);
                          setIsShareModalOpen(true);
                        }}
                        onDeleteVideo={handleDeleteVideo}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      <AddVideoModal
        isOpen={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        onAddVideo={handleAddVideo}
        playlists={playlists}
      />

      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        video={selectedVideoForPlaylist}
        playlists={playlists}
        onClose={() => {
          setIsPlaylistModalOpen(false);
          setSelectedVideoForPlaylist(null);
        }}
        onCreatePlaylist={handleCreatePlaylist}
        onToggleVideoInPlaylist={handleToggleVideoInPlaylist}
        onDeletePlaylist={handleDeletePlaylist}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        video={selectedVideoForShare}
        onClose={() => {
          setIsShareModalOpen(false);
          setSelectedVideoForShare(null);
        }}
      />

      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearch={(query) => {
          setSearchQuery(query);
          setActiveView('home');
        }}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={handleDataRestored}
      />
    </div>
  );
}
