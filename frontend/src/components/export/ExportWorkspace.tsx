import React from 'react';
import { useMarkdownOptimize } from '../../hooks/useMarkdownOptimize';
import { TokenSavingsBar } from './TokenSavingsBar';
import { ExportActions } from './ExportActions';
import { MarkdownEditor } from '../../components/markdown/MarkdownEditor';
import { MarkdownPreview } from '../../components/markdown/MarkdownPreview';

interface ExportWorkspaceProps {
  sessionId: string;
}

export const ExportWorkspace: React.FC<ExportWorkspaceProps> = ({ sessionId }) => {
  const {
    data,
    selectedMode,
    setSelectedMode,
    activeMarkdown,
    isLoading,
    error,
  } = useMarkdownOptimize(sessionId);

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-xl">
        <p className="text-xs text-gray-500 font-medium">Calculating Token Savings & Optimizing Markdown...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
        {error || 'Failed to load optimization workspace.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TokenSavingsBar stats={data.token_stats} />

      <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded-xl">
        <span className="text-xs font-bold text-gray-800">Select Output Mode:</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setSelectedMode('standard')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              selectedMode === 'standard'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Standard Markdown
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode('optimized')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              selectedMode === 'optimized'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✨ LLM-Optimized
          </button>
        </div>
      </div>

      <ExportActions
        sessionId={sessionId}
        selectedMode={selectedMode}
        activeMarkdown={activeMarkdown}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MarkdownEditor value={activeMarkdown} onChange={() => {}} />
        <MarkdownPreview content={activeMarkdown} />
      </div>
    </div>
  );
};