export type ImageCategory = 'decorative' | 'content' | 'important' | 'unknown';
export type AiAnalysisStatus = 'not_analyzed' | 'processing' | 'completed' | 'error';

export interface ImageClassification {
  category: ImageCategory;
  confidence: number;
  score: number;
  reasons: string[];
}

export interface ImageBlock {
  id: string;
  type: 'image';
  original: {
    filename: string;
    mime: string;
    width: number | null;
    height: number | null;
    size: number;
  };
  preview: {
    url: string;
  };
  asset: {
    url: string;
  };
  markdown: {
    alt: string;
    path: string;
  };
  ai: {
    status: AiAnalysisStatus;
    description: string | null;
  };
  classification: ImageClassification;
  isDuplicate: boolean;
  duplicateOf: string | null;
  occurrenceCount: number;
  pageNumber: number | null;
}