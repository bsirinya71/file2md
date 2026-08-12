export type UploadStatus = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

export interface UploadResponseData {
  session_id: string;
  original_filename: string;
  saved_filename: string;
  file_size_bytes: number;
  mime_type: string;
  file_extension: string;
  message: string;
}

export interface FileValidationError {
  code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'EMPTY_FILE';
  message: string;
}

export interface UploadState {
  status: UploadStatus;
  file: File | null;
  progress: number;
  error: string | null;
  responseData: UploadResponseData | null;
}