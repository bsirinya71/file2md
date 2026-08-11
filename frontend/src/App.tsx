import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { ActiveTab, ConversionOptions } from './types';
import { useConverter } from './hooks/useConverter';
import { useTheme } from './hooks/useTheme';
import { useStats } from './hooks/useStats';
import { composeMarkdown, composeMarkdownForStats } from './utils/markdownCompose';

import Header from './components/Header';
import OptionsToolbar from './components/OptionsToolbar';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import ConversionDivider from './components/ConversionDivider';
import StatsFooter from './components/StatsFooter';

export default function App() {
  const { file, loading, blocks, uploadFile } = useConverter();
  const { theme, toggleTheme } = useTheme();

  const [options, setOptions] = useState<ConversionOptions>({
    stripHeaders: false,
    cleanWhitespace: true,
    removeIcons: false,
    includeImages: true,
    addLlmPrompt: false,
  });

  // markdown เต็ม (มีรูปจริง) ไว้ preview / copy / download
  const composed = useMemo(() => composeMarkdown(blocks, options), [blocks, options]);

  // markdown เวอร์ชัน "สะอาด" ไว้คำนวณ stats เท่านั้น (ตัด base64 ออก)
  const composedForStats = useMemo(
    () => composeMarkdownForStats(blocks, options),
    [blocks, options]
  );

  const [markdown, setMarkdown] = useState('');
  useEffect(() => {
    setMarkdown(composed);
  }, [composed]);

  const { stats, optimization } = useStats(composedForStats, composedForStats);
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) uploadFile(e.target.files[0]);
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-ink)] text-[var(--color-text)] font-body">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <OptionsToolbar
        options={options}
        onOptionsChange={setOptions}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fileName={file?.name ?? null}
        onFileChange={handleFileChange}
      />

      <main className="flex-1 flex overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : !markdown ? (
          <EmptyState onFileDrop={uploadFile} />
        ) : (
          <>
            <EditorPanel markdown={markdown} onChange={setMarkdown} activeTab={activeTab} />
            <ConversionDivider active={false} />
            <PreviewPanel markdown={markdown} activeTab={activeTab} />
          </>
        )}
      </main>

      {markdown && (
        <StatsFooter stats={stats} optimization={optimization} markdown={markdown} fileName={file?.name ?? null} />
      )}
    </div>
  );
}