import React, { useState } from 'react';
import { ImageBlock } from '../../types/image';

interface EditAltModalProps {
  image: ImageBlock | null;
  onSave: (imageId: string, newAlt: string) => void;
  onClose: () => void;
}

export const EditAltModal: React.FC<EditAltModalProps> = ({ image, onSave, onClose }) => {
  const [altText, setAltText] = useState(image?.markdown?.alt || '');

  if (!image) return null;

  const handleSave = () => {
    onSave(image.id, altText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-5 max-w-md w-full space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-gray-900">Edit Alt Text ({image.id})</h3>
        <div>
          <label className="block text-xs text-gray-600 font-medium mb-1">Alt Text (Markdown Description)</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Image description..."
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-500 rounded-md hover:bg-brand-600 shadow-xs"
          >
            Save Alt Text
          </button>
        </div>
      </div>
    </div>
  );
};