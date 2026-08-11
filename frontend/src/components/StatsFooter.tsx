import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import type { ConversionStats, OptimizationSummary } from '../types';

interface StatsFooterProps {
  stats: ConversionStats;
  optimization: OptimizationSummary;
  markdown: string;
  fileName: string | null;
}

export default function StatsFooter({ stats, optimization, markdown, fileName }: StatsFooterProps) {
  const [copied, setCopied] = useState(false);
  const saved = optimization.tokensSaved;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? `${fileName.split('.')[0]}.md` : 'converted.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 border-t border-[var(--color-line)] bg-[var(--color-surface-2)]">
      <div className="flex items-center gap-5 font-display text-[11px] text-[var(--color-text-muted)] tracking-wide">
        <span>WORDS <strong className="text-[var(--color-text)] ml-1">{stats.words}</strong></span>
        <span>TOKENS <strong className="text-[var(--color-amber)] ml-1">{stats.tokens}</strong></span>
        <span>CHARS <strong className="text-[var(--color-text)] ml-1">{stats.characters}</strong></span>

        {saved !== 0 && (
          <span
            className={`px-2 py-0.5 rounded-full border text-[10px] ${
              saved > 0
                ? 'border-[var(--color-teal)] text-[var(--color-teal)] bg-[var(--color-teal)]/10'
                : 'border-[var(--color-danger)] text-[var(--color-danger)] bg-[var(--color-danger)]/10'
            }`}
          >
            {saved > 0 ? `-${saved} tokens saved` : `+${Math.abs(saved)} tokens added`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 border border-[var(--color-line)] hover:border-[var(--color-text-muted)] text-[var(--color-text)] px-3 py-1.5 rounded-md font-display text-xs transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[var(--color-teal)]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'copied' : 'copy for llm'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 bg-[var(--color-amber)] hover:brightness-110 text-[var(--color-ink)] px-3 py-1.5 rounded-md font-display text-xs font-semibold transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>export .md</span>
        </button>
      </div>
    </footer>
  );
}