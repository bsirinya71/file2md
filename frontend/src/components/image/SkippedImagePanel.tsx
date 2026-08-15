import React from 'react';
import { ImageBlock } from '../../types/image';
import { SkippedImageCard } from './SkippedImageCard';

interface SkippedImagePanelProps {
  skippedImages: ImageBlock[];
  sessionId: string;
  onRestore: (imageId: string) => void;
  onZoom: (img: ImageBlock) => void;
}

export const SkippedImagePanel: React.FC<SkippedImagePanelProps> = ({
  skippedImages,
  sessionId,
  onRestore,
  onZoom,
}) => {
  if (skippedImages.length === 0) {
    return (
      <div className="p-8 text-center bg-green-50 border border-green-200 rounded-xl space-y-2">
        <h4 className="text-sm font-bold text-green-800">No Skipped Images</h4>
        <p className="text-xs text-green-700">
          All extracted images are currently included in the Markdown output stream.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3">
        <span className="text-amber-600 text-lg">⚠️</span>
        <div className="text-xs text-amber-800">
          <h4 className="font-bold text-sm">Review Skipped (Decorative) Images ({skippedImages.length})</h4>
          <p className="mt-0.5">
            The system automatically excluded these images to prevent noise in the generated Markdown. You can inspect and restore any image back into the document stream.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skippedImages.map((img) => (
          <SkippedImageCard
            key={img.id}
            image={img}
            sessionId={sessionId}
            onRestore={onRestore}
            onZoom={onZoom}
          />
        ))}
      </div>
    </div>
  );
};