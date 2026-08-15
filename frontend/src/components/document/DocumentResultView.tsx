import React, { useState } from 'react';
import { DocumentAst } from '../../types/extraction';
import { calculateAstStats } from '../../utils/astUtils';
import { DocumentHeader } from './DocumentHeader';
import { StatsSummary } from './StatsSummary';
import { AstInspector } from './AstInspector';
import { JsonViewer } from './JsonViewer';
import { MarkdownWorkspace } from '../../components/markdown/MarkdownWorkspace';
import { ImageManagerView } from '../image/ImageManagerView';

interface DocumentResultViewProps {
  ast: DocumentAst;
  onReset: () => void;
}

export const DocumentResultView: React.FC<DocumentResultViewProps> = ({ ast, onReset }) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'images' | 'structured' | 'json'>('markdown');
  const stats = calculateAstStats(ast);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <DocumentHeader title={ast.title} sessionId={ast.session_id} onReset={onReset} />

      <StatsSummary stats={stats} />

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex border-b border-gray-200 space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('markdown')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'markdown'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Markdown Editor & Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'images'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Image Manager ({stats.imagesCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('structured')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'structured'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Structured Nodes ({ast.blocks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'json'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Raw JSON Structure
          </button>
        </div>

        {activeTab === 'markdown' && <MarkdownWorkspace sessionId={ast.session_id} />}
        {activeTab === 'images' && (
          <ImageManagerView sessionId={ast.session_id} initialImages={ast.images || []} />
        )}
        {activeTab === 'structured' && <AstInspector blocks={ast.blocks} />}
        {activeTab === 'json' && <JsonViewer data={ast} />}
      </div>
    </div>
  );
};