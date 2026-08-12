import type { ImageBlock } from "./image";

export type DocumentType = 'pdf' | 'docx' | 'pptx' | 'image' | 'unknown';

export type BlockType = 'heading' | 'paragraph' | 'list' | 'table' | 'code' | 'image';

export interface ListItemNode {
  text: string;
  level: number;
}

export interface BaseAstBlock {
  block_type: BlockType;
  metadata: Record<string, unknown>;
}

export interface HeadingAstBlock extends BaseAstBlock {
  block_type: 'heading';
  level: number; // 1-6
  text: string;
}

export interface ParagraphAstBlock extends BaseAstBlock {
  block_type: 'paragraph';
  text: string;
}

export interface ListAstBlock extends BaseAstBlock {
  block_type: 'list';
  ordered: boolean;
  items: ListItemNode[];
}

export interface TableAstBlock extends BaseAstBlock {
  block_type: 'table';
  headers: string[];
  rows: string[][];
}

export interface CodeAstBlock extends BaseAstBlock {
  block_type: 'code';
  language: string | null;
  code: string;
}

export interface ImageAstBlock extends BaseAstBlock {
  block_type: 'image';
  image_id: string;
  alt_text: string;
  asset_path: string;
  preview_url: string | null;
  ai_description: string | null;
}

export type AstBlock =
  | HeadingAstBlock
  | ParagraphAstBlock
  | ListAstBlock
  | TableAstBlock
  | CodeAstBlock
  | ImageAstBlock;

export interface DocumentAst {
  session_id: string;
  title: string | null;
  blocks: AstBlock[];
  images: ImageBlock[];
  metadata: Record<string, unknown>;
}