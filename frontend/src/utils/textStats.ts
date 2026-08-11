import type { ConversionStats } from '../types';

/**
 * ประมาณจำนวน token แบบคร่าวๆ ด้วยกฎ "1 token ~ 4 ตัวอักษร"
 * ซึ่งเป็นค่าประมาณมาตรฐานที่ใช้กันทั่วไปสำหรับข้อความภาษาอังกฤษ
 * (ไม่ใช่ tokenizer จริง แต่คำนวณฝั่ง client ได้ทันทีแบบ real-time)
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function computeStats(text: string): ConversionStats {
  return {
    words: countWords(text),
    tokens: estimateTokens(text),
    characters: text.length,
  };
}