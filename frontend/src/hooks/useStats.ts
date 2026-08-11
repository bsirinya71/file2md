import { useMemo } from 'react';
import { computeStats, estimateTokens } from '../utils/textStats';
import type { ConversionStats, OptimizationSummary } from '../types';

/**
 * รับ text สำหรับ "แสดงผล/copy" (statsSourceText) แยกจาก text จริงที่ใช้คำนวณ stats
 * เพื่อไม่ให้ base64 รูปภาพไปปนกับตัวเลข token count
 */
export function useStats(statsSourceText: string, rawStatsSourceText: string) {
  const stats = useMemo<ConversionStats>(() => computeStats(statsSourceText), [statsSourceText]);

  const optimization = useMemo<OptimizationSummary>(() => {
    const rawTokens = estimateTokens(rawStatsSourceText);
    const optimizedTokens = estimateTokens(statsSourceText);
    return { rawTokens, optimizedTokens, tokensSaved: rawTokens - optimizedTokens };
  }, [statsSourceText, rawStatsSourceText]);

  return { stats, optimization };
}