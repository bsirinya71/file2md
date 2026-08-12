import React, { useState } from 'react';
import { useMarkdownSync } from '../../hooks/useMarkdownSync';
import { MarkdownToolbar, ViewMode } from './MarkdownToolbar';
import { MarkdownPreview } from './MarkdownPreview';
import { MarkdownEditor } from './Markdowneditor';

interface MarkdownWorkspaceProps {
  sessionId: string;
}

export const MarkdownWorkspace: React.FC<MarkdownWorkspaceProps> = ({ sessionId }) => {
  const { markdown, setMarkdown, isLoading, error } = useMarkdownSync(sessionId);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-xl">
        <p className="text-xs text-gray-500 font-medium">Generating Standard Markdown...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <MarkdownToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        markdownText={markdown}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={viewMode === 'editor' ? 'col-span-2' : 'col-span-1'}>
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={viewMode === 'preview' ? 'col-span-2' : 'col-span-1'}>
            <MarkdownPreview content={markdown} />
          </div>
        )}
      </div>
    </div>
  );
};