import { useMemo } from 'react';
import { computeStats, estimateTokens } from '../utils/textStats';
import type { ConversionStats, OptimizationSummary } from '../types';

export function useStats(markdown: string, rawMarkdown: string) {
  const stats = useMemo<ConversionStats>(() => computeStats(markdown), [markdown]);

  const optimization = useMemo<OptimizationSummary>(() => {
    const rawTokens = estimateTokens(rawMarkdown);
    const optimizedTokens = estimateTokens(markdown);
    return {
      rawTokens,
      optimizedTokens,
      tokensSaved: rawTokens - optimizedTokens,
    };
  }, [markdown, rawMarkdown]);

  return { stats, optimization };
}