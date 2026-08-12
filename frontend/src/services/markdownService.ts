import { apiClient } from '../services/apiClient';

export interface MarkdownGenerationResponse {
  session_id: string;
  markdown: string;
  block_count: number;
}

class MarkdownService {
  /**
   * Fetch Standard Markdown string from backend
   */
  public async getStandardMarkdown(sessionId: string): Promise<MarkdownGenerationResponse> {
    return apiClient.post<MarkdownGenerationResponse>('/markdown/generate', {
      session_id: sessionId,
    });
  }
}

export const markdownService = new MarkdownService();