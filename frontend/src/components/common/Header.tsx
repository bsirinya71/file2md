import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-500 text-white p-2 rounded-lg font-bold text-xl tracking-wider">
            F2M
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">FILE2MD</h1>
            <p className="text-xs text-gray-500">Document to Structured Markdown Converter</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            System Ready
          </span>
        </div>
      </div>
    </header>
  );
};