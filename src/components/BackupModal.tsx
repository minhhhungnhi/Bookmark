import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { storage } from '../services/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const json = storage.exportLibraryJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youlibrary-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMsg({ type: 'success', text: 'Library successfully exported as JSON file!' });
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to export library data.' });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storage.importLibraryJSON(content);
      if (res.success) {
        setStatusMsg({ type: 'success', text: `Imported ${res.count} videos successfully!` });
        onDataRestored();
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to import JSON file.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your library to the initial curated starter videos?')) {
      storage.resetToDefaults();
      setStatusMsg({ type: 'success', text: 'Reset to default library completed.' });
      onDataRestored();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#212121] text-white p-6 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-medium">Library Backup & Data</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-xs text-neutral-400">
            Save a backup of your personal YouTube library, import an existing collection JSON, or restore the default curated videos.
          </p>

          {/* Export */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="text-sm font-medium">Export Video Library</p>
              <p className="text-xs text-neutral-400">Download all videos, playlists & notes as JSON</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="text-sm font-medium">Import Video Library</p>
              <p className="text-xs text-neutral-400">Load a previously exported .json file</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>

          {/* Reset */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-red-300">Reset to Defaults</p>
              <p className="text-xs text-red-400/80">Restore initial curated videos and playlists</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-xs font-medium text-red-200 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
