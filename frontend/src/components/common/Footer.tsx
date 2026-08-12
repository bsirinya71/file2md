import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>© 2026 FILE2MD Converter. High-Performance AST Document Engine.</p>
        <p className="mt-2 sm:mt-0">Vite + React + TypeScript Architecture</p>
      </div>
    </footer>
  );
};