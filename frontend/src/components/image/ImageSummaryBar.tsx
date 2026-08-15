import React from 'react';

interface ImageSummaryBarProps {
  stats: {
    total: number;
    content: number;
    decorative: number;
    important: number;
    duplicates: number;
  };
}

export const ImageSummaryBar: React.FC<ImageSummaryBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="p-3 bg-white border border-gray-200 rounded-lg text-center">
        <span className="text-xl font-bold text-gray-900">{stats.total}</span>
        <p className="text-xs text-gray-500 font-medium">Images Found</p>
      </div>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <span className="text-xl font-bold text-blue-700">{stats.content}</span>
        <p className="text-xs text-blue-600 font-medium">Content Images</p>
      </div>
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
        <span className="text-xl font-bold text-purple-700">{stats.important}</span>
        <p className="text-xs text-purple-600 font-medium">Important</p>
      </div>
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
        <span className="text-xl font-bold text-amber-700">{stats.decorative}</span>
        <p className="text-xs text-amber-600 font-medium">Decorative</p>
      </div>
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
        <span className="text-xl font-bold text-red-700">{stats.duplicates}</span>
        <p className="text-xs text-red-600 font-medium">Duplicates</p>
      </div>
    </div>
  );
};