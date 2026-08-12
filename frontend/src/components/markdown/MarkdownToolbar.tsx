import React, { useState } from 'react';

export type ViewMode = 'split' | 'editor' | 'preview';

interface MarkdownToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  markdownText: string;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  viewMode,
  onViewModeChange,
  markdownText,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-gray-100 border border-gray-200 rounded-t-xl">
      <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
        <button
          type="button"
          onClick={() => onViewModeChange('split')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            viewMode === 'split' ? 'bg-brand-500 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Split View
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('editor')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            viewMode === 'editor' ? 'bg-brand-500 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Editor Only
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('preview')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            viewMode === 'preview' ? 'bg-brand-500 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Preview Only
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1.5 shadow-xs"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
        </button>
      </div>
    </div>
  );
};