/**
 * Utility functions for YouTube URL parsing, thumbnails, and metadata retrieval.
 */

export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character alphanumeric/dash/underscore string
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  try {
    const url = new URL(trimmed);
    if (url.searchParams.has('v')) {
      const v = url.searchParams.get('v');
      if (v && v.length === 11) return v;
    }
  } catch {
    // Not a valid URL
  }

  return null;
}

export function getYouTubeThumbnail(videoId: string, quality: 'max' | 'hq' | 'mq' | 'default' = 'hq'): string {
  switch (quality) {
    case 'max':
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    case 'mq':
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    case 'default':
      return `https://img.youtube.com/vi/${videoId}/default.jpg`;
    case 'hq':
    default:
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
}

export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = true, startTimeSeconds?: number): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    playsinline: '1',
  });
  if (startTimeSeconds && startTimeSeconds > 0) {
    params.set('start', startTimeSeconds.toString());
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export async function fetchYouTubeOEmbed(videoId: string): Promise<{
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
} | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title,
        author_name: data.author_name,
        author_url: data.author_url,
        thumbnail_url: data.thumbnail_url,
      };
    }
  } catch (err) {
    console.warn('Failed to fetch oEmbed metadata:', err);
  }
  return null;
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export function parseSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
