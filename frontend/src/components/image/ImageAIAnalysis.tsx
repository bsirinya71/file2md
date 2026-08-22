import React, { useState } from 'react';
import { ImageBlock } from '../../types/image';

interface ImageAIAnalysisProps {
  image: ImageBlock;
  onAnalyze: (imageId: string) => void;
  onUpdateDescription?: (imageId: string, desc: string) => void;
}

export const ImageAIAnalysis: React.FC<ImageAIAnalysisProps> = ({
  image,
  onAnalyze,
  onUpdateDescription,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(image.ai.description || '');

  const handleSaveEdit = () => {
    if (onUpdateDescription) {
      onUpdateDescription(image.id, editedText);
    }
    setIsEditing(false);
  };

  const status = image.ai.status;

  return (
    <div className="p-3 bg-purple-50/50 border border-purple-200/80 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-purple-900 flex items-center space-x-1.5">
          <span>✨</span>
          <span>Gemini Vision AI Analysis</span>
        </span>

        {status === 'completed' && (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded">
            COMPLETED
          </span>
        )}
      </div>

      {status === 'not_analyzed' && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-purple-700">No AI description generated yet.</p>
          <button
            type="button"
            onClick={() => onAnalyze(image.id)}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center space-x-1"
          >
            <span>Analyze Image</span>
          </button>
        </div>
      )}

      {status === 'processing' && (
        <div className="py-2 flex items-center space-x-2 text-xs text-purple-700 font-medium">
          <svg className="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Analyzing image with Gemini Vision AI...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center justify-between text-xs text-red-600 pt-1">
          <span>Failed to analyze image.</span>
          <button
            type="button"
            onClick={() => onAnalyze(image.id)}
            className="text-xs font-semibold text-purple-800 underline hover:text-purple-900"
          >
            Retry Analysis
          </button>
        </div>
      )}

      {status === 'completed' && image.ai.description && (
        <div className="space-y-2 pt-1">
          {isEditing ? (
            <div className="space-y-1.5">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-2 text-xs border border-purple-300 rounded bg-white outline-none focus:ring-1 focus:ring-purple-500"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-[11px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-2 py-1 text-[11px] bg-purple-600 text-white font-semibold rounded hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-800 bg-white p-2.5 rounded border border-purple-100 leading-relaxed font-sans">
                {image.ai.description}
              </p>
              <div className="flex justify-end space-x-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-purple-700 hover:text-purple-900 font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onAnalyze(image.id)}
                  className="text-purple-700 hover:text-purple-900 font-semibold"
                >
                  Re-analyze
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};