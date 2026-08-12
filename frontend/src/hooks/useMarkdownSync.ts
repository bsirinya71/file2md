import { useState, useEffect, useCallback } from 'react';
import { markdownService } from '../services/markdownService';

export function useMarkdownSync(sessionId: string) {
  const [markdown, setMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkdown = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await markdownService.getStandardMarkdown(sessionId);
      setMarkdown(data.markdown);
    } catch (err: unknown) {
      setError('Failed to load generated Markdown content.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchMarkdown();
  }, [fetchMarkdown]);

  return {
    markdown,
    setMarkdown,
    isLoading,
    error,
    refreshMarkdown: fetchMarkdown,
  };
}