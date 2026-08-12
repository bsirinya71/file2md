import { useState, useCallback } from 'react';
import { UploadState, UploadResponseData } from '../types/upload';
import { validateFile } from '../utils/fileUtils';
import { uploadService } from '../services/uploadService';
import { CustomApiError } from '../types/api';

interface UseFileUploadReturn {
  uploadState: UploadState;
  selectFile: (file: File) => void;
  startUpload: () => Promise<UploadResponseData | null>;
  resetUpload: () => void;
}

const initialUploadState: UploadState = {
  status: 'idle',
  file: null,
  progress: 0,
  error: null,
  responseData: null,
};

export function useFileUpload(onSuccessCallback?: (data: UploadResponseData) => void): UseFileUploadReturn {
  const [uploadState, setUploadState] = useState<UploadState>(initialUploadState);

  const selectFile = useCallback((file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setUploadState({
        status: 'error',
        file: file,
        progress: 0,
        error: validationError.message,
        responseData: null,
      });
      return;
    }

    setUploadState({
      status: 'selected',
      file: file,
      progress: 0,
      error: null,
      responseData: null,
    });
  }, []);

  const startUpload = useCallback(async (): Promise<UploadResponseData | null> => {
    if (!uploadState.file || uploadState.status === 'uploading') {
      return null;
    }

    setUploadState((prev) => ({
      ...prev,
      status: 'uploading',
      progress: 15,
      error: null,
    }));

    try {
      const data = await uploadService.uploadFile(uploadState.file, (percent) => {
        setUploadState((prev) => ({ ...prev, progress: percent }));
      });

      setUploadState({
        status: 'success',
        file: uploadState.file,
        progress: 100,
        error: null,
        responseData: data,
      });

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }

      return data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof CustomApiError
          ? err.message
          : 'Failed to upload document. Please check server connection.';

      setUploadState((prev) => ({
        ...prev,
        status: 'error',
        progress: 0,
        error: errorMessage,
      }));

      return null;
    }
  }, [uploadState.file, uploadState.status, onSuccessCallback]);

  const resetUpload = useCallback(() => {
    setUploadState(initialUploadState);
  }, []);

  return {
    uploadState,
    selectFile,
    startUpload,
    resetUpload,
  };
}