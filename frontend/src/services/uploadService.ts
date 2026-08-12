import { apiClient } from '../services/apiClient';
import { UploadResponseData } from '../types/upload';

class UploadService {
  /**
   * Upload file to backend /upload endpoint using FormData
   */
  public async uploadFile(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResponseData> {
    const formData = new FormData();
    formData.append('file', file);

    // Simulate progress updates if XMLHttpRequest / Fetch doesn't expose native progress easily
    if (onProgress) {
      onProgress(10);
    }

    try {
      const response = await apiClient.post<UploadResponseData>('/upload', formData);
      if (onProgress) {
        onProgress(100);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const uploadService = new UploadService();