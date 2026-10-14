export interface VideoComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

export interface VideoNote {
  id: string;
  timestampSeconds?: number;
  timestampLabel?: string;
  text: string;
  createdAt: number;
}

export interface Video {
  id: string; // YouTube 11-char ID (e.g. "dQw4w9WgXcQ")
  title: string;
  channelTitle: string;
  channelAvatar?: string;
  channelSubscribers?: string;
  verified?: boolean;
  description: string;
  category: string;
  tags: string[];
  duration: string; // e.g. "12:45"
  viewCount: string; // e.g. "2.4M views"
  publishedAt: string; // e.g. "3 months ago"
  addedAt: number; // timestamp
  isLiked: boolean;
  isWatchLater: boolean;
  isFavorite: boolean;
  notes?: VideoNote[];
  comments?: VideoComment[];
  customThumbnailUrl?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  videoIds: string[];
  createdAt: number;
  coverVideoId?: string;
}

export type ActiveView = 
  | 'home' 
  | 'watch' 
  | 'explore' 
  | 'subscriptions' 
  | 'library' 
  | 'history' 
  | 'watch-later' 
  | 'liked' 
  | 'favorites' 
  | 'playlist';

export interface HistoryItem {
  videoId: string;
  watchedAt: number;
  progressPercent?: number;
}
