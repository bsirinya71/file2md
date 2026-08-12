import React from 'react';

interface UploadErrorProps {
  message: string;
  onRetry?: () => void;
}

export const UploadError: React.FC<UploadErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
      <div className="text-red-500 flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-semibold text-red-800">Unable to process document</h4>
        <p className="text-xs text-red-700 mt-1">{message}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-red-800 underline hover:text-red-900"
          >
            Try another file
          </button>
        )}
      </div>
    </div>
  );
};