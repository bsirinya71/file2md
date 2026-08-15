import React from 'react';
import { ImageBlock } from '../../types/image';
import { imageService } from '../../services/imageService';
import { formatBytes } from '../../utils/fileUtils';

interface ImageCardProps {
  image: ImageBlock;
  sessionId: string;
  onZoom: (img: ImageBlock) => void;
  onEditAlt: (img: ImageBlock) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  sessionId,
  onZoom,
  onEditAlt,
}) => {
  // const imageUrl = imageService.getImageUrl(sessionId, image.id, 'thumbnail');
  const imageUrl = imageService.getImageUrl(sessionId, image.id, 'original');

  const renderBadge = () => {
    const category = image.classification?.category || 'unknown';
    switch (category) {
      case 'content':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">CONTENT</span>;
      case 'important':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">IMPORTANT</span>;
      case 'decorative':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">DECORATIVE</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-bold rounded">UNKNOWN</span>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
      <div className="relative group bg-gray-900/5 aspect-video flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={image.markdown?.alt || image.id}
          className="object-contain max-h-full max-w-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
          }}
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button
            type="button"
            onClick={() => onZoom(image)}
            className="px-2.5 py-1.5 bg-white/90 text-gray-900 rounded text-xs font-semibold hover:bg-white"
          >
            🔍 Zoom
          </button>
        </div>

        <div className="absolute top-2 left-2 flex items-center space-x-1">
          {renderBadge()}
          {image.isDuplicate && (
            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded">DUPLICATE</span>
          )}
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-900 truncate max-w-[160px]">{image.id}</p>
            <p className="text-[10px] text-gray-500 font-mono">
              {image.original?.width && image.original?.height
                ? `${image.original.width}x${image.original.height} px • `
                : ''}
              {formatBytes(image.original?.size || 0)}
            </p>
          </div>
        </div>

        <div className="p-2 bg-gray-50 rounded border border-gray-100 flex justify-between items-center text-xs">
          <span className="text-gray-600 truncate font-mono text-[11px] max-w-[140px]">
            {image.markdown?.alt || 'No Alt Text'}
          </span>
          <button
            type="button"
            onClick={() => onEditAlt(image)}
            className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};