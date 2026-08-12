import { apiClient } from '../services/apiClient';
import { DocumentAst } from '../types/extraction';

export interface ExtractRequestPayload {
  session_id: string;
}

class DocumentService {
  /**
   * Process document extraction on backend (/api/v1/extract)
   */
  public async extractDocument(sessionId: string): Promise<DocumentAst> {
    return apiClient.post<DocumentAst>('/extract', {
      session_id: sessionId,
    });
  }

  /**
   * Fetch generated Markdown AST (/api/v1/markdown/ast)
   */
  public async getDocumentAst(sessionId: string): Promise<DocumentAst> {
    return apiClient.post<DocumentAst>('/markdown/ast', {
      session_id: sessionId,
    });
  }
}

export const documentService = new DocumentService();