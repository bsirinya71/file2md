import type { ActiveTab } from '../types';

interface EditorPanelProps {
  markdown: string;
  onChange: (value: string) => void;
  activeTab: ActiveTab;
}

export default function EditorPanel({ markdown, onChange, activeTab }: EditorPanelProps) {
  return (
    <div className={`flex-1 flex-col bg-[var(--color-ink)] ${activeTab === 'editor' ? 'flex' : 'hidden md:flex'}`}>
      <div className="px-4 py-2 bg-[var(--color-surface-2)] flex items-center gap-2 text-[11px] font-display text-[var(--color-text-muted)] tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)]" />
        RAW MARKDOWN
      </div>
      <textarea
        value={markdown}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full bg-[var(--color-ink)] text-[var(--color-text)] font-display text-sm p-5 resize-none focus:outline-none leading-relaxed"
        placeholder="markdown output will appear here…"
      />
    </div>
  );
}