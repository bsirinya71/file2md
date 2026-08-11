from typing import List
from app.schemas.markdown_ast import (
    ASTBlock,
    ASTBlockType,
    CodeASTBlock,
    DocumentAST,
    HeadingASTBlock,
    ImageASTBlock,
    ListASTBlock,
    MarkdownGenerationResult,
    ParagraphASTBlock,
    TableASTBlock,
)


class MarkdownGeneratorService:
    def generate_standard_markdown(self, ast: DocumentAST) -> MarkdownGenerationResult:
        """
        Render DocumentAST into a Standard GFM Markdown string.
        """
        markdown_parts: List[str] = []

        for block in ast.blocks:
            rendered = self._render_block(block)
            if rendered:
                markdown_parts.append(rendered)

        full_markdown = "\n\n".join(markdown_parts).strip()

        return MarkdownGenerationResult(
            session_id=ast.session_id,
            markdown=full_markdown,
            block_count=len(ast.blocks),
        )

    def _render_block(self, block: ASTBlock) -> str:
        if isinstance(block, HeadingASTBlock):
            return self._render_heading(block)
        elif isinstance(block, ParagraphASTBlock):
            return self._render_paragraph(block)
        elif isinstance(block, ListASTBlock):
            return self._render_list(block)
        elif isinstance(block, TableASTBlock):
            return self._render_table(block)
        elif isinstance(block, CodeASTBlock):
            return self._render_code(block)
        elif isinstance(block, ImageASTBlock):
            return self._render_image(block)
        return ""

    @staticmethod
    def _render_heading(block: HeadingASTBlock) -> str:
        level_prefix = "#" * min(max(block.level, 1), 6)
        # Clean inline newlines inside heading text
        clean_text = block.text.replace("\n", " ").strip()
        return f"{level_prefix} {clean_text}"

    @staticmethod
    def _render_paragraph(block: ParagraphASTBlock) -> str:
        return block.text.strip()

    @staticmethod
    def _render_list(block: ListASTBlock) -> str:
        lines = []
        for idx, item in enumerate(block.items, start=1):
            indent = "  " * (max(item.level, 1) - 1)
            prefix = f"{idx}." if block.ordered else "-"
            lines.append(f"{indent}{prefix} {item.text.strip()}")
        return "\n".join(lines)

    @staticmethod
    def _render_table(block: TableASTBlock) -> str:
        if not block.headers and not block.rows:
            return ""

        lines = []
        
        # Prepare Headers
        headers = [h.replace("\n", " ").strip() for h in block.headers] if block.headers else []
        
        # If no headers provided, fallback to default column names
        if not headers and block.rows:
            col_count = len(block.rows[0])
            headers = [f"Column {i+1}" for i in range(col_count)]

        header_line = "| " + " | ".join(headers) + " |"
        separator_line = "| " + " | ".join(["---"] * len(headers)) + " |"
        
        lines.append(header_line)
        lines.append(separator_line)

        # Prepare Rows
        for row in block.rows:
            # Pad or trim row to match headers count
            padded_row = row + [""] * (len(headers) - len(row)) if len(row) < len(headers) else row[:len(headers)]
            clean_row = [cell.replace("\n", " ").replace("|", "\\|").strip() for cell in padded_row]
            lines.append("| " + " | ".join(clean_row) + " |")

        return "\n".join(lines)

    @staticmethod
    def _render_code(block: CodeASTBlock) -> str:
        lang = block.language or ""
        return f"```{lang}\n{block.code.strip()}\n```"

    @staticmethod
    def _render_image(block: ImageASTBlock) -> str:
        alt = block.alt_text or f"Image_{block.image_id}"
        # Standard Markdown Image Syntax
        return f"![{alt}]({block.asset_path})"


markdown_generator_service = MarkdownGeneratorService()