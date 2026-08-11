import { useState } from 'react';
import type { ConversionOptions } from '../types';

const API_URL = 'http://127.0.0.1:8000/api/v1/converter/convert';

export function useConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string>('');
  const [rawMarkdown, setRawMarkdown] = useState<string>(''); // ต้นฉบับตอนแปลงเสร็จ ใช้เทียบตอนแก้ไข

  const convert = async (uploadedFile: File, options: ConversionOptions) => {
    setLoading(true);
    setFile(uploadedFile);

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('strip_headers_footers', String(options.stripHeaders));
    formData.append('clean_whitespace', String(options.cleanWhitespace));
    formData.append('remove_icons', String(options.removeIcons));
    formData.append('add_llm_prompt', String(options.addLlmPrompt));

    try {
      const response = await fetch(API_URL, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Conversion failed');

      const data = await response.json();
      setMarkdown(data.markdown);
      setRawMarkdown(data.markdown);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการแปลงไฟล์ กรุณาตรวจสอบว่า Backend FastAPI รันอยู่หรือไม่');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { file, loading, markdown, rawMarkdown, setMarkdown, convert };
}