import { apiClient } from '../services/apiClient';

export interface AiAnalyzeRequest {
  session_id: string;
  image_id: string;
  image_path?: string;
  prompt_hint?: string;
}

export interface AiAnalyzeResponse {
  session_id: string;
  image_id: string;
  status: 'completed' | 'error';
  description: string;
  message?: string;
}

class AiService {
  /**
   * Request Gemini Vision AI analysis for a specific image (/api/v1/ai/analyze-image)
   */
  public async analyzeImage(payload: AiAnalyzeRequest): Promise<AiAnalyzeResponse> {
    return apiClient.post<AiAnalyzeResponse>('/ai/analyze-image', {
      session_id: payload.session_id,
      image_id: payload.image_id,
      image_path: payload.image_path || `images/${payload.image_id}.png`,
      prompt_hint: payload.prompt_hint,
    });
  }
}

export const aiService = new AiService();