import React, { useState } from 'react';
import { ImageBlock } from '../../types/image';
import { useImageManager } from '../../hooks/useImageManager';
import { ImageSummaryBar } from './ImageSummaryBar';
import { ImageFilter } from './ImageFilter';
import { ImageCard } from './ImageCard';
import { ImageModal } from './ImageModal';
import { EditAltModal } from './EditAltModal';
import { SkippedImagePanel } from './SkippedImagePanel';

interface ImageManagerViewProps {
  sessionId: string;
  initialImages?: ImageBlock[];
}

export const ImageManagerView: React.FC<ImageManagerViewProps> = ({ sessionId, initialImages = [] }) => {
  const {
    images,
    skippedImages,
    stats,
    isLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    updateAltText,
    restoreImage,
  } = useImageManager(sessionId, initialImages);

  const [selectedZoomImage, setSelectedZoomImage] = useState<ImageBlock | null>(null);
  const [selectedEditAltImage, setSelectedEditAltImage] = useState<ImageBlock | null>(null);
  const [subTab, setSubTab] = useState<'all' | 'skipped'>('all');

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-gray-500 font-medium">Loading extracted images...</div>;
  }

  return (
    <div className="space-y-4">
      <ImageSummaryBar stats={stats} />

      <div className="flex border-b border-gray-200 space-x-4">
        <button
          type="button"
          onClick={() => setSubTab('all')}
          className={`pb-2 text-xs font-bold transition-colors border-b-2 ${
            subTab === 'all'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Images ({stats.total - stats.decorative})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('skipped')}
          className={`pb-2 text-xs font-bold transition-colors border-b-2 ${
            subTab === 'skipped'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Skipped Images ({stats.decorative})
        </button>
      </div>

      {subTab === 'all' ? (
        <>
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
        </>
      ) : (
        <SkippedImagePanel
          skippedImages={skippedImages}
          sessionId={sessionId}
          onRestore={restoreImage}
          onZoom={setSelectedZoomImage}
        />
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