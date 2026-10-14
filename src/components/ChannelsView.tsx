import React from 'react';
import { Tv, CheckCircle2, Play } from 'lucide-react';
import { Video } from '../types/video';

interface ChannelsViewProps {
  videos: Video[];
  onSelectChannel: (channelName: string) => void;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({ videos, onSelectChannel }) => {
  // Group videos by channelTitle
  const channelMap = new Map<
    string,
    { channelTitle: string; channelAvatar?: string; subscribers?: string; count: number; sampleVideos: Video[] }
  >();

  for (const v of videos) {
    const existing = channelMap.get(v.channelTitle);
    if (existing) {
      existing.count += 1;
      existing.sampleVideos.push(v);
    } else {
      channelMap.set(v.channelTitle, {
        channelTitle: v.channelTitle,
        channelAvatar: v.channelAvatar,
        subscribers: v.channelSubscribers,
        count: 1,
        sampleVideos: [v],
      });
    }
  }

  const channels = Array.from(channelMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 pb-6 border-b border-neutral-200 dark:border-[#272727]">
        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-[#272727] flex items-center justify-center">
          <Tv className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Subscribed & Curated Channels</h1>
          <p className="text-xs text-neutral-500">
            {channels.length} creators across your personal library
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {channels.map((ch) => (
          <div
            key={ch.channelTitle}
            onClick={() => onSelectChannel(ch.channelTitle)}
            className="flex flex-col items-center p-6 rounded-2xl bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/5 hover:border-neutral-400 dark:hover:border-white/20 transition-all cursor-pointer group text-center"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-800 mb-3 group-hover:scale-105 transition-transform">
              <img
                src={
                  ch.channelAvatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(ch.channelTitle)}`
                }
                alt={ch.channelTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-1 font-semibold text-sm text-neutral-900 dark:text-white">
              <span>{ch.channelTitle}</span>
              <CheckCircle2 className="w-3.5 h-3.5 fill-neutral-500 text-white dark:text-[#0f0f0f]" />
            </div>

            <p className="text-xs text-neutral-500 mt-1">{ch.subscribers || 'Creator'}</p>

            <span className="mt-3 px-3 py-1 rounded-full bg-neutral-200 dark:bg-white/10 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {ch.count} {ch.count === 1 ? 'saved video' : 'saved videos'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
