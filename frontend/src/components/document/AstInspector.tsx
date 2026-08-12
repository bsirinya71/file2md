import React from 'react';
import { AstBlock } from '../../types/extraction';
import { AstBlockCard } from './AstBlockCard';

interface AstInspectorProps {
  blocks: AstBlock[];
}

export const AstInspector: React.FC<AstInspectorProps> = ({ blocks }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-gray-800">Extracted AST Nodes ({blocks.length})</h3>
      </div>

      <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
        {blocks.map((block, idx) => (
          <AstBlockCard key={idx} block={block} index={idx} />
        ))}
      </div>
    </div>
  );
};