import React from 'react';

interface DocumentHeaderProps {
  title: string | null;
  sessionId: string;
  onReset: () => void;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ title, sessionId, onReset }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            Converted
          </span>
          <h2 className="text-xl font-bold text-gray-900 truncate max-w-md">
            {title || 'Untitled Document'}
          </h2>
        </div>
        <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
          <span>Session ID:</span>
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-mono">{sessionId}</code>
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1.5"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Convert Another</span>
      </button>
    </div>
  );
};