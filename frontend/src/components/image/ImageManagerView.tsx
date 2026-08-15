import React, { useState } from 'react';
import { ImageBlock } from '../../types/image';
import { useImageManager } from '../../hooks/useImageManager';
import { ImageSummaryBar } from './ImageSummaryBar';
import { ImageFilter } from './ImageFilter';
import { ImageCard } from './ImageCard';
import { ImageModal } from './ImageModal';
import { EditAltModal } from './EditAltModal';

interface ImageManagerViewProps {
  sessionId: string;
  initialImages?: ImageBlock[];
}

export const ImageManagerView: React.FC<ImageManagerViewProps> = ({ sessionId, initialImages = [] }) => {
  const {
    images,
    stats,
    isLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    updateAltText,
  } = useImageManager(sessionId, initialImages);

  const [selectedZoomImage, setSelectedZoomImage] = useState<ImageBlock | null>(null);
  const [selectedEditAltImage, setSelectedEditAltImage] = useState<ImageBlock | null>(null);

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-gray-500 font-medium">Loading extracted images...</div>;
  }

  return (
    <div className="space-y-4">
      <ImageSummaryBar stats={stats} />

      <ImageFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {images.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500">
          No images match the selected filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              sessionId={sessionId}
              onZoom={setSelectedZoomImage}
              onEditAlt={setSelectedEditAltImage}
            />
          ))}
        </div>
      )}

      <ImageModal
        image={selectedZoomImage}
        sessionId={sessionId}
        onClose={() => setSelectedZoomImage(null)}
      />

      <EditAltModal
        image={selectedEditAltImage}
        onSave={updateAltText}
        onClose={() => setSelectedEditAltImage(null)}
      />
    </div>
  );
};