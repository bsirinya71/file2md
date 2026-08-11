import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-[var(--color-line)] bg-[var(--color-surface-2)]">
      <div className="flex items-center gap-2 font-display">
        <span className="text-[var(--color-amber)] text-lg">&gt;</span>
        <span className="text-[15px] font-semibold tracking-tight text-[var(--color-text)]">file2md</span>
        <span className="w-[7px] h-[15px] bg-[var(--color-amber)] ml-0.5 animate-beam-pulse" />
      </div>

      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-[var(--color-line)] hover:border-[var(--color-amber)] text-[var(--color-text-muted)] hover:text-[var(--color-amber)] transition-colors"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  );
}