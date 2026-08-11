export default function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md h-72 rounded-lg border border-[var(--color-line)] overflow-hidden bg-[var(--color-surface)]">
        <div className="absolute inset-x-0 h-px bg-[var(--color-amber)] shadow-[0_0_12px_2px_var(--color-amber)] animate-scan-line" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="font-display text-xs text-[var(--color-amber)] tracking-widest">SCANNING</span>
          <p className="text-xs text-[var(--color-text-muted)]">converting document to markdown…</p>
        </div>
      </div>
    </div>
  );
}