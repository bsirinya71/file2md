import { useState } from 'react';
import type { DocumentBlock } from '../types';

const API_URL = 'http://127.0.0.1:8000/api/v1/converter/convert';

export function useConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<DocumentBlock[]>([]);

  const uploadFile = async (uploadedFile: File) => {
    setLoading(true);
    setFile(uploadedFile);

    const formData = new FormData();
    formData.append('file', uploadedFile);
    // ไม่ส่ง options แล้ว — backend ทำแค่ OCR + จัดหมวดหมู่ block เท่านั้น
    // การกรอง/ประกอบ markdown ตาม options ทำที่ frontend ทั้งหมด

    try {
      const response = await fetch(API_URL, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Conversion failed');

      const data = await response.json();
      setBlocks(data.blocks ?? []);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการแปลงไฟล์ กรุณาตรวจสอบว่า Backend FastAPI รันอยู่หรือไม่');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { file, loading, blocks, uploadFile };
}