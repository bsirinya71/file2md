import React from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-b-xl sm:rounded-bl-xl sm:rounded-br-none">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-mono font-semibold text-gray-500">
        Markdown Raw Editor
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or edit Markdown here..."
        className="w-full h-[550px] p-4 text-xs font-mono text-gray-800 bg-white resize-none outline-none focus:ring-0 border-0 leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
};