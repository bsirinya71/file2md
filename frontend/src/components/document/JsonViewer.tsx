import React, { useState } from 'react';

interface JsonViewerProps {
  data: unknown;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/80 border-b border-gray-800">
        <span className="text-xs font-mono text-gray-300 font-semibold">Raw AST Structure</span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-gray-300 hover:text-white px-2.5 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-green-400 overflow-x-auto max-h-[500px] overflow-y-auto">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
};