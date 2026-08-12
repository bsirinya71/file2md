import { FileValidationError } from "../types/upload";

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.png', '.jpg', '.jpeg', '.webp'];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
  'image/webp',
];

/**
 * Format bytes into human-readable string (e.g., 2.5 MB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Validate selected file for size and mime type
 */
export function validateFile(file: File): FileValidationError | null {
  if (file.size === 0) {
    return {
      code: 'EMPTY_FILE',
      message: 'The selected file is empty (0 bytes). Please choose a valid file.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      code: 'FILE_TOO_LARGE',
      message: `File size exceeds the 50 MB limit. Current size: ${formatBytes(file.size)}.`,
    };
  }

  const fileNameLower = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext));
  const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);

  if (!hasValidExtension && !hasValidMime) {
    return {
      code: 'INVALID_TYPE',
      message: `Unsupported file format. Allowed formats: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return null;
}

/**
 * Get display icon type based on extension
 */
export function getFileTypeCategory(filename: string): 'pdf' | 'docx' | 'pptx' | 'image' | 'unknown' {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'pptx' || ext === 'ppt') return 'pptx';
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) return 'image';
  return 'unknown';
}