import { apiClient } from '../services/apiClient';

export interface OptimizedMarkdownData {
  session_id: string;
  standard_markdown: string;
  optimized_markdown: string;
  token_stats: {
    standard_tokens: number;
    optimized_tokens: number;
    saved_tokens: number;
    savings_percentage: number;
  };
}

export interface OptimizedMarkdownResponse {
  success: boolean;
  data: OptimizedMarkdownData;
}

class ExportService {
  /**
   * Fetch LLM-Optimized Markdown and token savings stats (/api/v1/markdown/optimize)
   */
  public async getOptimizedMarkdown(sessionId: string): Promise<OptimizedMarkdownData> {
    const response = await apiClient.post<OptimizedMarkdownResponse | OptimizedMarkdownData>('/markdown/optimize', {
      session_id: sessionId,
    });

    if ('data' in response && response.data) {
      return response.data;
    }
    return response as OptimizedMarkdownData;
  }

  /**
   * Download Markdown File (.md) via POST /api/v1/export/markdown
   */
  public async downloadMarkdownFile(sessionId: string, mode: 'standard' | 'optimized' = 'standard'): Promise<void> {
    const response = await apiClient.post<Blob>(
      '/export/markdown',
      { session_id: sessionId, mode },
      { responseType: 'blob' }
    );

    const blob = new Blob([response], { type: 'text/markdown;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `document-${mode}.md`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Download Assets ZIP Bundle (.zip) via POST /api/v1/export/bundle
   */
  public async downloadAssetsBundle(sessionId: string): Promise<void> {
    const response = await apiClient.post<Blob>(
      '/export/bundle',
      { session_id: sessionId },
      { responseType: 'blob' }
    );

    const blob = new Blob([response], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `document-assets.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();