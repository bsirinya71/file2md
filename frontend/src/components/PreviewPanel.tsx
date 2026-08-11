import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ActiveTab } from '../types';

interface PreviewPanelProps {
  markdown: string;
  activeTab: ActiveTab;
}

export default function PreviewPanel({ markdown, activeTab }: PreviewPanelProps) {
  return (
    <div className={`flex-1 flex-col bg-[var(--color-surface)] ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
      <div className="px-4 py-2 bg-[var(--color-surface-2)] flex items-center gap-2 text-[11px] font-display text-[var(--color-text-muted)] tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
        PREVIEW
      </div>
      <div className="flex-1 p-6 overflow-y-auto prose prose-theme max-w-none font-body prose-headings:font-display prose-table:border-collapse prose-th:border prose-th:border-[var(--color-line)] prose-td:border prose-td:border-[var(--color-line)]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}