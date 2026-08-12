import React from 'react';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  // Safe simple markdown-to-HTML parser for basic preview rendering
  const renderFormattedMarkdown = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-bold text-gray-900 my-3">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-bold text-gray-800 my-2.5 border-b border-gray-200 pb-1">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-gray-800 my-2">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={idx} className="ml-5 list-disc text-xs text-gray-700 my-0.5">{trimmed.substring(2)}</li>;
      }
      if (trimmed.startsWith('![')) {
        const altMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
        if (altMatch) {
          return (
            <div key={idx} className="my-3 p-2 bg-gray-50 border border-gray-200 rounded text-center">
              <span className="text-xs text-gray-500 font-mono">📷 Image: {altMatch[1]} ({altMatch[2]})</span>
            </div>
          );
        }
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }

      return <p key={idx} className="text-xs text-gray-700 my-1 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-b-xl sm:rounded-br-xl sm:rounded-bl-none">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-mono font-semibold text-gray-500">
        Live Rendered Preview
      </div>
      <div className="p-5 h-[550px] overflow-y-auto prose max-w-none">
        {content ? renderFormattedMarkdown(content) : <p className="text-xs text-gray-400 italic">No content to preview.</p>}
      </div>
    </div>
  );
};