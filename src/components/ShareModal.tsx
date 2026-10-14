import React, { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink } from 'lucide-react';
import { Video } from '../types/video';

interface ShareModalProps {
  isOpen: boolean;
  video: Video | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, video, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [startAt, setStartAt] = useState(false);
  const [startSeconds, setStartSeconds] = useState(0);

  if (!isOpen || !video) return null;

  const rawUrl = `https://youtu.be/${video.id}`;
  const shareUrl = startAt ? `${rawUrl}?t=${startSeconds}` : rawUrl;
  const embedCode = `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${video.id}${startAt ? `?start=${startSeconds}` : ''}" title="${video.title.replace(/"/g, '&quot;')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#212121] text-white p-6 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-lg font-medium">Share Video</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Video Preview */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="w-20 h-12 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{video.title}</p>
              <p className="text-xs text-neutral-400">{video.channelTitle}</p>
            </div>
          </div>

          {/* Copy Direct Link */}
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1.5">Direct Video Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-red-500"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Start at Timestamp Checkbox */}
          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={startAt}
                onChange={(e) => setStartAt(e.target.checked)}
                className="w-4 h-4 rounded accent-red-600"
              />
              Start at
            </label>
            {startAt && (
              <input
                type="number"
                min="0"
                value={startSeconds}
                onChange={(e) => setStartSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-sm text-center text-white"
                placeholder="Seconds"
              />
            )}
            {startAt && <span className="text-xs text-neutral-400">seconds into video</span>}
          </div>

          {/* Embed Code Snippet */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                HTML Embed Code
              </label>
              <button
                onClick={handleCopyEmbed}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedEmbed ? 'Embed Code Copied' : 'Copy Embed Code'}
              </button>
            </div>
            <textarea
              readOnly
              rows={2}
              value={embedCode}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-neutral-400 font-mono resize-none focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              Open on YouTube.com <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
