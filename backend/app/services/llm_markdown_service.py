from typing import List
from app.schemas.extraction import ImageCategory
from app.schemas.markdown_ast import (
    ASTBlock,
    CodeASTBlock,
    DocumentAST,
    HeadingASTBlock,
    ImageASTBlock,
    ListASTBlock,
    LLMMarkdownGenerationResult,
    LLMMarkdownOptions,
    ParagraphASTBlock,
    TableASTBlock,
)


class LLMMarkdownService:
    def generate_llm_optimized_markdown(
        self,
        ast: DocumentAST,
        options: LLMMarkdownOptions = None
    ) -> LLMMarkdownGenerationResult:
        """
        Render DocumentAST into an LLM Optimized Markdown string.
        """
        if options is None:
            options = LLMMarkdownOptions()

        markdown_parts: List[str] = []
        filtered_images_count = 0
        total_blocks_rendered = 0

        for block in ast.blocks:
            # 1. Image Filter Logic (Token Optimization)
            if isinstance(block, ImageASTBlock):
                if options.remove_decorative_images and block.classification:
                    if block.classification.category == ImageCategory.DECORATIVE:
                        filtered_images_count += 1
                        continue  # Skip decorative image to save tokens

                if not options.include_image_tags:
                    filtered_images_count += 1
                    continue

            rendered = self._render_llm_block(block)
            if rendered:
                markdown_parts.append(rendered)
                total_blocks_rendered += 1

        full_markdown = "\n\n".join(markdown_parts).strip()

        return LLMMarkdownGenerationResult(
            session_id=ast.session_id,
            markdown=full_markdown,
            block_count=total_blocks_rendered,
            filtered_images_count=filtered_images_count,
            options_used=options
        )

    def _render_llm_block(self, block: ASTBlock) -> str:
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
            return self._render_llm_image_tag(block)
        return ""

    @staticmethod
    def _render_heading(block: HeadingASTBlock) -> str:
        level_prefix = "#" * min(max(block.level, 1), 6)
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
        headers = [h.replace("\n", " ").strip() for h in block.headers] if block.headers else []
        
        if not headers and block.rows:
            col_count = len(block.rows[0])
            headers = [f"Column {i+1}" for i in range(col_count)]

        header_line = "| " + " | ".join(headers) + " |"
        separator_line = "| " + " | ".join(["---"] * len(headers)) + " |"
        
        lines.append(header_line)
        lines.append(separator_line)

        for row in block.rows:
            padded_row = row + [""] * (len(headers) - len(row)) if len(row) < len(headers) else row[:len(headers)]
            clean_row = [cell.replace("\n", " ").replace("|", "\\|").strip() for cell in padded_row]
            lines.append("| " + " | ".join(clean_row) + " |")

        return "\n".join(lines)

    @staticmethod
    def _render_code(block: CodeASTBlock) -> str:
        lang = block.language or ""
        return f"```{lang}\n{block.code.strip()}\n```"

    @staticmethod
    def _render_llm_image_tag(block: ImageASTBlock) -> str:
        """
        Render Image Block into Structured LLM Tag Format.
        """
        description = block.ai_description or block.alt_text or "No description available"
        category = block.classification.category.value if block.classification else "unknown"

        return (
            f'[IMAGE id="{block.image_id}" category="{category}"]\n'
            f"Description: {description}\n"
            f"[/IMAGE]"
        )


llm_markdown_service = LLMMarkdownService()