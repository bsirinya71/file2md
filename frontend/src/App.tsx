import { useState, type ChangeEvent } from 'react';
import type { ActiveTab, ConversionOptions } from './types';
import { useConverter } from './hooks/useConverter';
import { useTheme } from './hooks/useTheme';
import { useStats } from './hooks/useStats';

import Header from './components/Header';
import OptionsToolbar from './components/OptionsToolbar';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import ConversionDivider from './components/ConversionDivider';
import StatsFooter from './components/StatsFooter';

export default function App() {
  const { file, loading, markdown, rawMarkdown, setMarkdown, convert } = useConverter();
  const { theme, toggleTheme } = useTheme();
  const { stats, optimization } = useStats(markdown, rawMarkdown);

  const [options, setOptions] = useState<ConversionOptions>({
    stripHeaders: false,
    cleanWhitespace: true,
    removeIcons: false,
    addLlmPrompt: false,
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      convert(e.target.files[0], options);
    }
  };

  const handleFile = (selectedFile: File) => {
    convert(selectedFile, options);
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
          <EmptyState onFileDrop={handleFile} />
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