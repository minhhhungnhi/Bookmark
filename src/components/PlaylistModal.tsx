import React, { useState } from 'react';
import { X, Plus, FolderPlus, Check, Trash2 } from 'lucide-react';
import { Playlist, Video } from '../types/video';

interface PlaylistModalProps {
  isOpen: boolean;
  video: Video | null;
  playlists: Playlist[];
  onClose: () => void;
  onCreatePlaylist: (title: string, description?: string) => string;
  onToggleVideoInPlaylist: (playlistId: string, videoId: string) => void;
  onDeletePlaylist?: (playlistId: string) => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  video,
  playlists,
  onClose,
  onCreatePlaylist,
  onToggleVideoInPlaylist,
  onDeletePlaylist,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newId = onCreatePlaylist(newTitle.trim(), newDescription.trim());
    if (video) {
      onToggleVideoInPlaylist(newId, video.id);
    }
    setNewTitle('');
    setNewDescription('');
    setShowCreateForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#212121] text-white p-6 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-medium">
            {video ? 'Save to playlist' : 'Manage Playlists'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {video && (
          <p className="text-xs text-neutral-400 mt-2 line-clamp-1">
            Video: <span className="text-neutral-200 font-medium">{video.title}</span>
          </p>
        )}

        {/* Existing Playlists Checklist */}
        <div className="py-4 space-y-2 max-h-64 overflow-y-auto pr-1">
          {playlists.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-4">No playlists yet. Create your first one!</p>
          ) : (
            playlists.map((pl) => {
              const isInPlaylist = video ? pl.videoIds.includes(video.id) : false;
              return (
                <div
                  key={pl.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                    {video && (
                      <input
                        type="checkbox"
                        checked={isInPlaylist}
                        onChange={() => onToggleVideoInPlaylist(pl.id, video.id)}
                        className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                      />
                    )}
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-neutral-200 block truncate">{pl.title}</span>
                      <span className="text-xs text-neutral-400">
                        {pl.videoIds.length} {pl.videoIds.length === 1 ? 'video' : 'videos'}
                      </span>
                    </div>
                  </label>

                  {onDeletePlaylist && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete playlist "${pl.title}"?`)) {
                          onDeletePlaylist(pl.id);
                        }
                      }}
                      title="Delete playlist"
                      className="p-1.5 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Create New Playlist Form Toggle */}
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-sm font-medium text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create new playlist
          </button>
        ) : (
          <form onSubmit={handleCreate} className="mt-3 pt-3 border-t border-white/10 space-y-3">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Playlist Title *</label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Favorite Coding Tutorials"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Description (optional)</label>
              <input
                type="text"
                placeholder="Brief description of this playlist"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-sm font-medium text-white transition-colors cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
