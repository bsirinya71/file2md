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