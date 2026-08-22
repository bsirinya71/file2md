import React from 'react';
import { ImageBlock } from '../../types/image';
import { imageService } from '../../services/imageService';
import { formatBytes } from '../../utils/fileUtils';
import { ImageAIAnalysis } from './ImageAIAnalysis';

interface ImageModalProps {
  image: ImageBlock | null;
  sessionId: string;
  onClose: () => void;
  onAnalyzeAi?: (imageId: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  image,
  sessionId,
  onClose,
  onAnalyzeAi,
}) => {
  if (!image) return null;

  const imageUrl = imageService.getImageUrl(sessionId, image.id, 'original');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl overflow-hidden max-w-3xl w-full space-y-0 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white border-b border-gray-800">
          <h4 className="text-xs font-mono font-bold">{image.id}</h4>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-lg">
            ✕
          </button>
        </div>

        <div className="p-4 bg-gray-950 flex items-center justify-center overflow-hidden flex-1">
          <img src={imageUrl} alt={image.id} className="max-h-[45vh] object-contain rounded" />
        </div>

        <div className="p-4 bg-white text-xs space-y-3 border-t border-gray-200 overflow-y-auto">
          <div className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-2">
            <span>
              Dimensions: {image.original?.width || 'N/A'} x {image.original?.height || 'N/A'} px | Size:{' '}
              {formatBytes(image.original?.size || 0)}
            </span>
            <span>
              Category: <strong className="uppercase">{image.classification?.category}</strong>
            </span>
          </div>

          {onAnalyzeAi && (
            <ImageAIAnalysis image={image} onAnalyze={onAnalyzeAi} />
          )}
        </div>
      </div>
    </div>
  );
};