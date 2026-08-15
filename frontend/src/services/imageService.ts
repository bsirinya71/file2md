import { apiClient } from '../services/apiClient';
import { env } from '../config/env';
import { ImageBlock } from '../types/image';

export interface SessionImagesResponse {
  session_id: string;
  images: ImageBlock[];
  total_count: number;
}

class ImageService {
  /**
   * Get all extracted images for session (/api/v1/images/session/{session_id})
   */
  public async getSessionImages(sessionId: string): Promise<SessionImagesResponse> {
    return apiClient.get<SessionImagesResponse>(`/images/session/${sessionId}`);
  }

  /**
   * Helper to construct image stream URL
   */
  public getImageUrl(sessionId: string, imageId: string, variant: 'original' | 'thumbnail' = 'original'): string {
    return `${env.apiBaseUrl}/images/${sessionId}/${imageId}/${variant}`;
  }
}

export const imageService = new ImageService();