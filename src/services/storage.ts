import { Video, Playlist, HistoryItem } from '../types/video';
import { INITIAL_VIDEOS, INITIAL_PLAYLISTS } from '../data/initialVideos';

const STORAGE_KEYS = {
  VIDEOS: 'youlibrary_videos_v1',
  PLAYLISTS: 'youlibrary_playlists_v1',
  HISTORY: 'youlibrary_history_v1',
  THEME: 'youlibrary_theme_v1',
};

export const storage = {
  getVideos(): Video[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading videos from localStorage:', e);
    }
    // Default fallback
    this.saveVideos(INITIAL_VIDEOS);
    return INITIAL_VIDEOS;
  },

  saveVideos(videos: Video[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
    } catch (e) {
      console.error('Error saving videos to localStorage:', e);
    }
  },

  getPlaylists(): Playlist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading playlists from localStorage:', e);
    }
    this.savePlaylists(INITIAL_PLAYLISTS);
    return INITIAL_PLAYLISTS;
  },

  savePlaylists(playlists: Playlist[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.error('Error saving playlists to localStorage:', e);
    }
  },

  getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading history from localStorage:', e);
    }
    return [];
  },

  addToHistory(videoId: string): void {
    try {
      const history = this.getHistory();
      // Remove previous occurrence of the same video
      const filtered = history.filter((h) => h.videoId !== videoId);
      filtered.unshift({
        videoId,
        watchedAt: Date.now(),
      });
      // Keep up to 100 history items
      const truncated = filtered.slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(truncated));
    } catch (e) {
      console.warn('Error adding to history:', e);
    }
  },

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  getTheme(): 'dark' | 'light' {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // YouTube looks best in dark mode by default
  },

  saveTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  exportLibraryJSON(): string {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      videos: this.getVideos(),
      playlists: this.getPlaylists(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importLibraryJSON(jsonString: string): { success: boolean; count?: number; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.videos || !Array.isArray(data.videos)) {
        return { success: false, error: 'Invalid JSON format: missing videos array.' };
      }
      this.saveVideos(data.videos);
      if (data.playlists && Array.isArray(data.playlists)) {
        this.savePlaylists(data.playlists);
      }
      return { success: true, count: data.videos.length };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error parsing JSON';
      return { success: false, error: errorMsg };
    }
  },

  resetToDefaults(): void {
    this.saveVideos(INITIAL_VIDEOS);
    this.savePlaylists(INITIAL_PLAYLISTS);
    this.clearHistory();
  },
};
