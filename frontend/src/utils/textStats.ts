import type { ConversionStats } from '../types';

export function estimateTokens(text: string | undefined | null): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function countWords(text: string | undefined | null): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function computeStats(text: string | undefined | null): ConversionStats {
  return {
    words: countWords(text),
    tokens: estimateTokens(text),
    characters: text?.length ?? 0,
  };
}