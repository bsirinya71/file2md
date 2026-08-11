import { Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface UploadButtonProps {
  fileName: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadButton({ fileName, onFileChange }: UploadButtonProps) {
  return (
    <label className="flex items-center gap-2 bg-transparent border border-[var(--color-line)] hover:border-[var(--color-amber)] text-[var(--color-text)] px-3 py-1.5 rounded-md cursor-pointer text-xs font-medium font-display transition-colors">
      <Upload className="w-3.5 h-3.5 text-[var(--color-amber)]" />
      <span className="max-w-[140px] truncate">{fileName ?? 'select document'}</span>
      <input
        type="file"
        onChange={onFileChange}
        className="hidden"
        accept=".pdf,.docx,.xlsx,.pptx,.jpg,.png"
      />
    </label>
  );
}