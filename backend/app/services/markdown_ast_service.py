from typing import List, Optional
from app.schemas.extraction import BlockType, ExtractionResult
from app.schemas.markdown_ast import (
    ASTBlock,
    CodeASTBlock,
    DocumentAST,
    HeadingASTBlock,
    ImageASTBlock,
    ListASTBlock,
    ListItemNode,
    ParagraphASTBlock,
    TableASTBlock,
)


class MarkdownASTService:
    def build_ast(self, extraction_result: ExtractionResult) -> DocumentAST:
        """
        Convert ExtractionResult (flat block stream) into a structured Markdown AST.
        """
        ast_blocks: List[ASTBlock] = []
        current_list_items: List[ListItemNode] = []
        current_list_ordered: bool = False

        def flush_list():
            nonlocal current_list_items, current_list_ordered
            if current_list_items:
                ast_blocks.append(
                    ListASTBlock(
                        ordered=current_list_ordered,
                        items=current_list_items.copy()
                    )
                )
                current_list_items.clear()

        for block in extraction_result.blocks:
            # Group consecutive list items into a single ListASTBlock
            if block.block_type == BlockType.LIST_ITEM:
                text = block.text or ""
                is_ordered = False
                clean_text = text

                # Clean bullet/number symbols
                if text.startswith(("- ", "* ", "• ")):
                    clean_text = text[2:].strip()
                elif text[0].isdigit() and text[1:3] in [". ", ") "]:
                    is_ordered = True
                    clean_text = text[3:].strip()

                if not current_list_items:
                    current_list_ordered = is_ordered

                current_list_items.append(ListItemNode(text=clean_text, level=1))
                continue
            else:
                flush_list()

            # Process other block types
            if block.block_type == BlockType.HEADING:
                ast_blocks.append(
                    HeadingASTBlock(
                        level=min(max(block.level or 1, 1), 6),
                        text=block.text or "",
                        metadata=block.metadata
                    )
                )

            elif block.block_type == BlockType.PARAGRAPH:
                ast_blocks.append(
                    ParagraphASTBlock(
                        text=block.text or "",
                        metadata=block.metadata
                    )
                )

            elif block.block_type == BlockType.TABLE:
                rows_data = block.metadata.get("rows", [])
                headers = rows_data[0] if rows_data else []
                body_rows = rows_data[1:] if len(rows_data) > 1 else []
                
                ast_blocks.append(
                    TableASTBlock(
                        headers=headers,
                        rows=body_rows,
                        metadata=block.metadata
                    )
                )

            elif block.block_type == BlockType.CODE:
                ast_blocks.append(
                    CodeASTBlock(
                        language=block.metadata.get("language", None),
                        code=block.text or "",
                        metadata=block.metadata
                    )
                )

            elif block.block_type == BlockType.IMAGE and block.image_info:
                img = block.image_info
                asset_path = img.asset.url if img.asset else img.saved_path or ""
                preview_url = img.preview.url if img.preview else None

                ast_blocks.append(
                    ImageASTBlock(
                        image_id=img.image_id,
                        alt_text=f"Image {img.image_id}",
                        asset_path=asset_path,
                        preview_url=preview_url,
                        ai_description=None,  # On-Demand AI
                        classification=img.classification,
                        metadata=block.metadata
                    )
                )

        flush_list()  # Flush any remaining list items

        return DocumentAST(
            session_id=extraction_result.session_id,
            title=extraction_result.title,
            blocks=ast_blocks,
            metadata=extraction_result.metadata
        )


markdown_ast_service = MarkdownASTService()