import React from 'react';
import { ImageBlock } from '../../types/image';
import { imageService } from '../../services/imageService';
import { formatBytes } from '../../utils/fileUtils';

interface ImageModalProps {
  image: ImageBlock | null;
  sessionId: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, sessionId, onClose }) => {
  if (!image) return null;

  const imageUrl = imageService.getImageUrl(sessionId, image.id, 'original');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl overflow-hidden max-w-3xl w-full space-y-0 shadow-2xl">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white border-b border-gray-800">
          <h4 className="text-xs font-mono font-bold">{image.id}</h4>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-lg">
            ✕
          </button>
        </div>

        <div className="p-4 bg-gray-950 flex items-center justify-center max-h-[70vh]">
          <img src={imageUrl} alt={image.id} className="max-h-[60vh] object-contain rounded" />
        </div>

        <div className="p-4 bg-white text-xs space-y-1 border-t border-gray-200">
          <p className="font-semibold text-gray-900">
            Dimensions: {image.original?.width || 'N/A'} x {image.original?.height || 'N/A'} px | Size: {formatBytes(image.original?.size || 0)}
          </p>
          <p className="text-gray-600">Category: <span className="font-bold uppercase">{image.classification?.category}</span></p>
          <p className="text-gray-500 font-mono">Path: {image.markdown?.path}</p>
        </div>
      </div>
    </div>
  );
};