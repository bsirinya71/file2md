import React from 'react';
import {
  AstBlock,
  HeadingAstBlock,
  ParagraphAstBlock,
  ListAstBlock,
  TableAstBlock,
  CodeAstBlock,
  ImageAstBlock,
} from '../../types/extraction';

interface AstBlockCardProps {
  block: AstBlock;
  index: number;
}

export const AstBlockCard: React.FC<AstBlockCardProps> = ({ block, index }) => {
  const renderBadge = (label: string, colorClass: string) => (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${colorClass}`}>
      {label}
    </span>
  );

  const renderContent = () => {
    switch (block.block_type) {
      case 'heading': {
        const b = block as HeadingAstBlock;
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {renderBadge(`H${b.level}`, 'bg-blue-100 text-blue-800')}
              <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{b.text}</p>
          </div>
        );
      }
      case 'paragraph': {
        const b = block as ParagraphAstBlock;
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {renderBadge('Paragraph', 'bg-gray-100 text-gray-800')}
              <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
            </div>
            <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{b.text}</p>
          </div>
        );
      }
      case 'list': {
        const b = block as ListAstBlock;
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {renderBadge(b.ordered ? 'Ordered List' : 'List', 'bg-purple-100 text-purple-800')}
              <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
            </div>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
              {b.items.map((item, i) => (
                <li key={i}>{item.text}</li>
              ))}
            </ul>
          </div>
        );
      }
      case 'table': {
        const b = block as TableAstBlock;
        const headers = b.headers || [];
        const rows = b.rows || [];

        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {renderBadge('Table', 'bg-amber-100 text-amber-800')}
              <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-gray-200">
                {headers.length > 0 && (
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="px-2 py-1 text-left font-semibold text-gray-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-gray-100">
                      {(row || []).map((cell, cIdx) => (
                        <td key={cIdx} className="px-2 py-1 text-gray-600">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case 'code': {
        const b = block as CodeAstBlock;
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {renderBadge(`Code (${b.language || 'text'})`, 'bg-indigo-100 text-indigo-800')}
              <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
            </div>
            <pre className="p-2.5 bg-gray-900 text-gray-100 text-xs rounded font-mono overflow-x-auto">
              <code>{b.code}</code>
            </pre>
          </div>
        );
      }
      case 'image': {
        const b = block as unknown as Record<string, unknown>;
        const metadata = (b.metadata || {}) as Record<string, unknown>;
        
        // ค้นหาคีย์ Image ID จากทุกตำแหน่งที่อาจจะถูกส่งมา
        const imageId = String(
          b.image_id || b.id || metadata.image_id || metadata.id || 'N/A'
        );
        
        // ค้นหาคีย์ Asset Path / Preview URL
        const assetPath = String(
          b.asset_path || b.preview_url || metadata.asset_path || metadata.preview_url || ''
        );

        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {renderBadge('Image', 'bg-emerald-100 text-emerald-800')}
              <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
            </div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200 flex items-center space-x-3 text-xs">
              <span className="font-semibold text-gray-800">ID: {imageId}</span>
              {assetPath && assetPath !== 'undefined' && (
                <span className="text-gray-500 truncate max-w-xs">{assetPath}</span>
              )}
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="p-3.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      {renderContent()}
    </div>
  );
};