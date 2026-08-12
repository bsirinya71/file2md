import React from 'react';
import { formatBytes, getFileTypeCategory } from '../../utils/fileUtils';

interface FileCardProps {
  file: File;
  onRemove?: () => void;
  disabled?: boolean;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onRemove, disabled = false }) => {
  const category = getFileTypeCategory(file.name);

  const renderBadge = () => {
    switch (category) {
      case 'pdf':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">PDF</span>;
      case 'docx':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">DOCX</span>;
      case 'pptx':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">PPTX</span>;
      case 'image':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">IMAGE</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">FILE</span>;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 overflow-hidden">
        {renderBadge()}
        <div className="truncate">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label="Remove file"
          className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};