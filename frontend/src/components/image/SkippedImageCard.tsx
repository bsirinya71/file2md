import React from 'react';
import { ImageBlock } from '../../types/image';
import { imageService } from '../../services/imageService';
import { formatBytes } from '../../utils/fileUtils';

interface SkippedImageCardProps {
  image: ImageBlock;
  sessionId: string;
  onRestore: (imageId: string) => void;
  onZoom: (img: ImageBlock) => void;
}

export const SkippedImageCard: React.FC<SkippedImageCardProps> = ({
  image,
  sessionId,
  onRestore,
  onZoom,
}) => {
  const imageUrl = imageService.getImageUrl(sessionId, image.id, 'original');

  return (
    <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
      <div className="relative group bg-gray-900/5 aspect-video flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={image.id}
          className="object-contain max-h-full max-w-full opacity-75 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
          }}
        />

        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
            SKIPPED (DECORATIVE)
          </span>
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={() => onZoom(image)}
            className="px-2.5 py-1.5 bg-white/90 text-gray-900 rounded text-xs font-semibold hover:bg-white"
          >
            🔍 Zoom Preview
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div>
          <p className="text-xs font-bold text-gray-900 truncate">{image.id}</p>
          <p className="text-[10px] text-gray-500 font-mono">
            {image.original?.width && image.original?.height
              ? `${image.original.width}x${image.original.height} px • `
              : ''}
            {formatBytes(image.original?.size || 0)}
          </p>
        </div>

        {image.classification?.reasons && image.classification.reasons.length > 0 && (
          <div className="p-2 bg-amber-50 rounded border border-amber-100 text-[11px] text-amber-800 space-y-0.5">
            <span className="font-semibold block">Reason for Skipping:</span>
            <ul className="list-disc list-inside text-[10px] text-amber-700">
              {image.classification.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={() => onRestore(image.id)}
          className="w-full py-1.5 px-3 bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors"
        >
          <span>↩ Restore to Markdown</span>
        </button>
      </div>
    </div>
  );
};