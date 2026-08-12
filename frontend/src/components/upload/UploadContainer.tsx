import React from 'react';
import { Dropzone } from './Dropzone';
import { FileCard } from './FileCard';
import { UploadProgress } from './UploadProgress';
import { UploadResponseData } from '../../types/upload';
import { useFileUpload } from '../../hooks/useFileUpload';
import { UploadError } from './Uploaderror';

interface UploadContainerProps {
  onUploadSuccess: (data: UploadResponseData) => void;
}

export const UploadContainer: React.FC<UploadContainerProps> = ({ onUploadSuccess }) => {
  const { uploadState, selectFile, startUpload, resetUpload } = useFileUpload(onUploadSuccess);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {uploadState.status === 'idle' && (
        <Dropzone onFileSelect={selectFile} />
      )}

      {uploadState.status === 'selected' && uploadState.file && (
        <div className="space-y-4">
          <FileCard file={uploadState.file} onRemove={resetUpload} />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetUpload}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={startUpload}
              className="px-5 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-sm"
            >
              Upload & Convert
            </button>
          </div>
        </div>
      )}

      {uploadState.status === 'uploading' && (
        <div className="space-y-3">
          {uploadState.file && <FileCard file={uploadState.file} disabled />}
          <UploadProgress progress={uploadState.progress} />
        </div>
      )}

      {uploadState.status === 'error' && (
        <div className="space-y-3">
          {uploadState.file && <FileCard file={uploadState.file} onRemove={resetUpload} />}
          <UploadError message={uploadState.error || 'Unknown error'} onRetry={resetUpload} />
        </div>
      )}

      {uploadState.status === 'success' && uploadState.responseData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
          <div>
            <h4 className="text-sm font-semibold text-green-800">Upload Successful</h4>
            <p className="text-xs text-green-700">
              Session ID: <code className="bg-green-100 px-1 py-0.5 rounded font-mono">{uploadState.responseData.session_id}</code>
            </p>
          </div>
          <button
            type="button"
            onClick={resetUpload}
            className="text-xs font-semibold text-green-800 underline hover:text-green-900"
          >
            Upload another
          </button>
        </div>
      )}
    </div>
  );
};