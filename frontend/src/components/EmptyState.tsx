import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { FileText, UploadCloud } from 'lucide-react';

interface EmptyStateProps {
  onFileDrop: (file: File) => void;
}

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.pptx', '.jpg', '.jpeg', '.png'];

function Corner({ className }: { className: string }) {
  return <div className={`absolute w-6 h-6 border-[var(--color-amber)] transition-colors ${className}`} />;
}

export default function EmptyState({ onFileDrop }: EmptyStateProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSend = (f: File) => {
    const ext = `.${f.name.split('.').pop()?.toLowerCase()}`;
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      alert('ไฟล์นี้ไม่รองรับ กรุณาใช้ไฟล์ PDF, Word, Excel, PowerPoint หรือรูปภาพ');
      return;
    }
    onFileDrop(f);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateAndSend(droppedFile);
  };

  const handleBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndSend(f);
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`relative w-full max-w-md h-72 flex flex-col items-center justify-center gap-3 rounded-lg cursor-pointer transition-colors ${
          isDragging ? 'bg-[var(--color-amber)]/5' : 'hover:bg-[var(--color-surface)]/40'
        }`}
      >
        <input ref={inputRef} type="file" onChange={handleBrowse} className="hidden" accept={ACCEPTED_EXTENSIONS.join(',')} />

        <Corner className="top-0 left-0 border-t-2 border-l-2 rounded-tl-lg" />
        <Corner className="top-0 right-0 border-t-2 border-r-2 rounded-tr-lg" />
        <Corner className="bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg" />
        <Corner className="bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg" />

        {isDragging ? (
          <UploadCloud className="w-10 h-10 text-[var(--color-amber)]" />
        ) : (
          <FileText className="w-10 h-10 text-[var(--color-text-muted)]" />
        )}
        <p className="font-display text-sm text-[var(--color-text)]">
          {isDragging ? 'release to scan' : 'drop a document to scan'}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          or click here — pdf, docx, xlsx, pptx, jpg, png
        </p>
      </div>
    </div>
  );
}