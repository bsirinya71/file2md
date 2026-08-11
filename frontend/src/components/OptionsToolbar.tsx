import type { ChangeEvent } from 'react';
import type { ActiveTab, ConversionOptions } from '../types';
import UploadButton from './UploadButton';

interface OptionsToolbarProps {
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  fileName: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TOGGLES: { key: keyof ConversionOptions; label: string }[] = [
  { key: 'cleanWhitespace', label: 'clean whitespace' },
  { key: 'stripHeaders', label: 'strip headers/footers' },
  { key: 'removeIcons', label: 'remove icons' },
  { key: 'addLlmPrompt', label: 'add llm directive' },
];

export default function OptionsToolbar({
  options,
  onOptionsChange,
  activeTab,
  onTabChange,
  fileName,
  onFileChange,
}: OptionsToolbarProps) {
  const toggle = (key: keyof ConversionOptions) => onOptionsChange({ ...options, [key]: !options[key] });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-2.5 bg-[var(--color-ink)] border-b border-[var(--color-line)]">
      <div className="flex items-center gap-2 flex-wrap">
        {TOGGLES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`font-display text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
              options[key]
                ? 'border-[var(--color-amber)] text-[var(--color-amber)] bg-[var(--color-amber)]/10'
                : 'border-[var(--color-line)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <UploadButton fileName={fileName} onFileChange={onFileChange} />

        <div className="flex md:hidden bg-[var(--color-surface)] p-0.5 rounded-md border border-[var(--color-line)]">
          <button
            onClick={() => onTabChange('editor')}
            className={`px-3 py-1 rounded text-xs font-display transition-colors ${activeTab === 'editor' ? 'bg-[var(--color-amber)] text-[var(--color-ink)]' : 'text-[var(--color-text-muted)]'}`}
          >
            code
          </button>
          <button
            onClick={() => onTabChange('preview')}
            className={`px-3 py-1 rounded text-xs font-display transition-colors ${activeTab === 'preview' ? 'bg-[var(--color-amber)] text-[var(--color-ink)]' : 'text-[var(--color-text-muted)]'}`}
          >
            preview
          </button>
        </div>
      </div>
    </div>
  );
}