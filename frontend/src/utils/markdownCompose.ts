import type { ConversionOptions, DocumentBlock } from '../types';

const LLM_PROMPT_HEADER = `<!-- Converted document for LLM context -->\n\n`;
const LLM_PROMPT_FOOTER = `\n\n<!-- End of document -->`;

export function filterBlocks(blocks: DocumentBlock[], options: ConversionOptions): DocumentBlock[] {
  return blocks.filter((block) => {
    if (options.stripHeaders && (block.type === 'header' || block.type === 'footer')) return false;
    if (options.removeIcons && block.type === 'icon') return false;
    if (!options.includeImages && block.type === 'image') return false;
    return true;
  });
}

/**
 * บาง response จาก backend ใส่ syntax markdown ปนมาใน alt text เอง
 * เช่น "![Attached Image]" แทนที่จะเป็นแค่ "Attached Image"
 * ฟังก์ชันนี้ล้าง "![", "]" ที่ติดมาออกก่อนประกอบใหม่ กัน syntax ซ้อนกันพัง
 */
function sanitizeAlt(alt: string | undefined): string {
  if (!alt) return 'image';
  return alt.replace(/^!\[/, '').replace(/\]$/, '').trim() || 'image';
}

function renderBlock(block: DocumentBlock): string {
  if (block.type === 'image') {
    return `![${sanitizeAlt(block.alt)}](${block.src ?? ''})`;
  }
  return block.text ?? '';
}

export function joinBlocks(blocks: DocumentBlock[]): string {
  return blocks.map(renderBlock).join('\n\n');
}

export function cleanWhitespaceText(text: string): string {
  return text.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
}

export function applyLlmPrompt(text: string, enabled: boolean): string {
  return enabled ? `${LLM_PROMPT_HEADER}${text}${LLM_PROMPT_FOOTER}` : text;
}

export function composeMarkdown(blocks: DocumentBlock[], options: ConversionOptions): string {
  const filtered = filterBlocks(blocks, options);
  let text = joinBlocks(filtered);
  if (options.cleanWhitespace) text = cleanWhitespaceText(text);
  return applyLlmPrompt(text, options.addLlmPrompt);
}

/**
 * สำหรับคำนวณ stats (words/tokens/characters) เท่านั้น
 * ตัด base64 ของรูปออก ใช้แค่ placeholder แทน ไม่งั้น token count จะพองจาก base64 string
 * ที่ยาวหลักพัน-หมื่นตัวอักษรต่อรูป ซึ่งไม่ได้สะท้อน "เนื้อหา" จริงที่ LLM จะอ่าน
 */
export function composeMarkdownForStats(blocks: DocumentBlock[], options: ConversionOptions): string {
  const filtered = filterBlocks(blocks, options);
  const text = filtered
    .map((b) => (b.type === 'image' ? `[image: ${sanitizeAlt(b.alt)}]` : b.text ?? ''))
    .join('\n\n');
  return options.cleanWhitespace ? cleanWhitespaceText(text) : text;
}