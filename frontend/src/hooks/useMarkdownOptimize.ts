import { useState, useEffect, useCallback } from 'react';
import { exportService, OptimizedMarkdownData } from '../services/exportService';

export function useMarkdownOptimize(sessionId: string) {
  const [data, setData] = useState<OptimizedMarkdownData | null>(null);
  const [selectedMode, setSelectedMode] = useState<'standard' | 'optimized'>('standard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptimizationData = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await exportService.getOptimizedMarkdown(sessionId);
      setData(res);
    } catch {
      setError('Failed to calculate token optimization stats.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchOptimizationData();
  }, [fetchOptimizationData]);

  const activeMarkdown =
    selectedMode === 'optimized' && data?.optimized_markdown
      ? data.optimized_markdown
      : data?.standard_markdown || '';

  return {
    data,
    selectedMode,
    setSelectedMode,
    activeMarkdown,
    isLoading,
    error,
    refreshOptimization: fetchOptimizationData,
  };
}