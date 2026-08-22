import React, { useState } from 'react';
import { exportService } from '../../services/exportService';

interface ExportActionsProps {
  sessionId: string;
  selectedMode: 'standard' | 'optimized';
  activeMarkdown: string;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  sessionId,
  selectedMode,
  activeMarkdown,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloadingMd, setIsDownloadingMd] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = async () => {
    setIsDownloadingMd(true);
    try {
      await exportService.downloadMarkdownFile(sessionId, selectedMode);
    } catch (err) {
      console.error('Failed to download markdown:', err);
    } finally {
      setIsDownloadingMd(false);
    }
  };

  const handleDownloadBundle = async () => {
    setIsDownloadingZip(true);
    try {
      await exportService.downloadAssetsBundle(sessionId);
    } catch (err) {
      console.error('Failed to download assets bundle:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleDownloadMarkdown}
          disabled={isDownloadingMd}
          className="flex-1 sm:flex-none px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg shadow-xs transition-colors text-center flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span>📥</span>
          <span>{isDownloadingMd ? 'Downloading .md...' : 'Download .md File'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadBundle}
          disabled={isDownloadingZip}
          className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-bold rounded-lg shadow-xs transition-colors text-center flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span>📦</span>
          <span>{isDownloadingZip ? 'Downloading ZIP...' : 'Download Assets ZIP'}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-2"
      >
        <span>📋</span>
        <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
      </button>
    </div>
  );
};