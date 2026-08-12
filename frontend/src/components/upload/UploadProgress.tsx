import React from 'react';

interface UploadProgressProps {
  progress: number;
  message?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, message = 'Uploading document...' }) => {
  return (
    <div className="space-y-2 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-700 flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{message}</span>
        </span>
        <span className="font-semibold text-brand-600">{progress}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-brand-500 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};