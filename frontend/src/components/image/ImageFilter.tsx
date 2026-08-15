import React from 'react';

interface ImageFilterProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ImageFilter: React.FC<ImageFilterProps> = ({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  const categories = [
    { id: 'all', label: 'All Images' },
    { id: 'content', label: 'Content' },
    { id: 'important', label: 'Important' },
    { id: 'decorative', label: 'Decorative' },
    { id: 'duplicate', label: 'Duplicates' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeCategory === cat.id
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="w-full sm:w-64">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter images..."
          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
    </div>
  );
};