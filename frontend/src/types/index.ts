export type BlockType = 'header' | 'footer' | 'icon' | 'content' | 'image';

export interface DocumentBlock {
  type: BlockType;
  text?: string;   // header/footer/icon/content
  src?: string;    // image เท่านั้น — เป็น base64 data URI จาก backend ปัจจุบัน
  alt?: string;    // image เท่านั้น
}

export interface ConversionOptions {
  stripHeaders: boolean;
  cleanWhitespace: boolean;
  removeIcons: boolean;
  includeImages: boolean;
  addLlmPrompt: boolean;
}

export interface ConversionStats {
  words: number;
  tokens: number;
  characters: number;
}

export interface OptimizationSummary {
  rawTokens: number;
  optimizedTokens: number;
  tokensSaved: number;
}

export interface ConversionOptions {
  stripHeaders: boolean;
  cleanWhitespace: boolean;
  removeIcons: boolean;
  addLlmPrompt: boolean;
}

export type ActiveTab = 'editor' | 'preview';